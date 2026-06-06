import React, { useState, useEffect } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import RepoCard from './RepoCard';
import RepoCardList from './RepoCardList';

export default function RepoList({ categoryId, title }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);

  // View mode: 'grid' or 'list' — persisted in localStorage
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('repobagus_view_mode') || 'grid';
  });

  const toggleViewMode = (mode) => {
    setViewMode(mode);
    localStorage.setItem('repobagus_view_mode', mode);
  };

  useEffect(() => {
    setVisibleCount(6);
    
    const fetchRepoData = async () => {
      setLoading(true);
      setError(null);
      try {
        const pbResponse = await fetch('https://cms.sarjanakomputer.id/api/collections/curated_repos/records?perPage=500');
        if (!pbResponse.ok) {
          throw new Error('Gagal mengambil data kurasi dari CMS');
        }
        const pbData = await pbResponse.json();
        const curatedRepos = pbData.items
          .filter(item => item.is_active !== false)
          .map(item => ({
            id: item.id,
            fullName: item.full_name,
            category: item.category,
            name: item.fallback_name,
            description: item.fallback_desc,
            stargazers_count: item.stars,
            forks_count: item.forks,
            language: item.language,
            image: item.image ? `https://cms.sarjanakomputer.id/api/files/curated_repos/${item.id}/${item.image}` : null
          }));

        let filteredList = curatedRepos;
        if (categoryId && categoryId !== 'trending' && categoryId !== 'all') {
          filteredList = curatedRepos.filter(repo => repo.category === categoryId);
        }

        filteredList = [...filteredList].reverse();

        if (filteredList.length === 0) {
          setRepos([]);
          setLoading(false);
          return;
        }

        const repoPromises = filteredList.map(async (repoItem) => {
          if (repoItem.description) {
            const [owner, name] = repoItem.fullName.split('/');
            return {
              id: repoItem.id || Math.random().toString(),
              name: repoItem.name || name,
              full_name: repoItem.fullName,
              owner: repoItem.owner || {
                login: owner,
                avatar_url: `https://github.com/${owner}.png`
              },
              description: repoItem.description,
              stargazers_count: repoItem.stargazers_count,
              forks_count: repoItem.forks_count || 0,
              language: repoItem.language || 'Unknown',
              html_url: repoItem.html_url || `https://github.com/${repoItem.fullName}`,
              image: repoItem.image
            };
          }

          try {
            const response = await fetch(`https://api.github.com/repos/${repoItem.fullName}`);
            if (!response.ok) {
              throw new Error(`API returned ${response.status}`);
            }
            const data = await response.json();
            return {
              ...data,
              image: repoItem.image,
              description: repoItem.description || data.description
            };
          } catch (error) {
            console.warn(`Failed to fetch stats for ${repoItem.fullName}:`, error);
            const [owner, name] = repoItem.fullName.split('/');
            const dummyLangs = ["JavaScript", "TypeScript", "Python", "Vue", "React"];
            
            return {
              id: repoItem.id || Math.random().toString(),
              name: name || repoItem.fullName,
              full_name: repoItem.fullName,
              owner: {
                login: owner || 'Unknown',
                avatar_url: `https://github.com/${owner || 'github'}.png`
              },
              description: repoItem.description || `Proyek open-source inovatif untuk ${name || 'alat developer'}. (Data simulasi)`,
              stargazers_count: Math.floor(Math.random() * 5000) + 500,
              forks_count: Math.floor(Math.random() * 1000) + 100,
              language: dummyLangs[Math.floor(Math.random() * dummyLangs.length)],
              html_url: `https://github.com/${repoItem.fullName}`,
              image: repoItem.image
            };
          }
        });

        const fetchedRepos = await Promise.all(repoPromises);

        let validRepos = fetchedRepos.filter(Boolean);
        
        if (categoryId === 'trending' || (!categoryId && categoryId !== 'all')) {
          validRepos = validRepos.filter(repo => repo.stargazers_count > 5000 && repo.forks_count > 1000);
        }

        setRepos(validRepos);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepoData();
  }, [categoryId]);

  const visibleRepos = repos.slice(0, visibleCount);
  const isListView = viewMode === 'list';

  return (
    <div className="content-area">
      <div className="content-header">
        {(!categoryId || categoryId !== 'trending') && <h2 className="page-title">{title}</h2>}
        
        <div className="view-toggle">
          <button 
            className={`view-toggle-btn ${!isListView ? 'active' : ''}`}
            onClick={() => toggleViewMode('grid')}
            aria-label="Grid view"
            title="Tampilan Grid"
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            className={`view-toggle-btn ${isListView ? 'active' : ''}`}
            onClick={() => toggleViewMode('list')}
            aria-label="List view"
            title="Tampilan List"
          >
            <List size={18} />
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="loader">
          <h2>Memuat Data Repository...</h2>
        </div>
      ) : error ? (
        <div className="error">
          <p>Error: {error}</p>
        </div>
      ) : repos.length === 0 ? (
        <div className="empty-state">
          <p>Belum ada repository yang dikurasi untuk kategori ini.</p>
        </div>
      ) : (
        <>
          <div className={isListView ? 'repo-list-container' : 'repo-grid'}>
            {visibleRepos.map(repo => 
              isListView ? (
                <RepoCardList key={repo.id} repo={repo} />
              ) : (
                <RepoCard key={repo.id} repo={repo} />
              )
            )}
          </div>
          
          {visibleCount < repos.length && (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button 
                className="btn-secondary" 
                style={{ margin: '0 auto' }}
                onClick={() => setVisibleCount(prev => prev + 6)}
              >
                Memuat lebih banyak repositori...
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
