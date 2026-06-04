import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RepoCard from '../components/RepoCard';
import RepoCardList from '../components/RepoCardList';
import { LayoutGrid, List, Search } from 'lucide-react';
import './LandingPage.css';

export default function SearchPage() {
  const { query } = useParams();
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('repobagus_view_mode') || 'grid';
  });

  const toggleViewMode = (mode) => {
    setViewMode(mode);
    localStorage.setItem('repobagus_view_mode', mode);
  };

  useEffect(() => {
    const fetchSearch = async () => {
      setLoading(true);
      setError(null);
      try {
        // Ambil semua repositori dari CMS
        const res = await fetch('https://cms.sarjanakomputer.id/api/collections/curated_repos/records?perPage=500');
        if (!res.ok) throw new Error('Gagal mengambil data');
        const data = await res.json();
        
        const q = query.toLowerCase().trim();
        const filtered = data.items
          .filter(item => item.is_active !== false)
          .filter(item => {
            const name = (item.fallback_name || '').toLowerCase();
            const fullName = (item.full_name || '').toLowerCase();
            const desc = (item.fallback_desc || '').toLowerCase();
            const category = (item.category || '').toLowerCase();
            return name.includes(q) || fullName.includes(q) || desc.includes(q) || category.includes(q);
          })
          .map(item => {
            const [owner, name] = (item.full_name || '').split('/');
            return {
              id: item.id,
              fullName: item.full_name,
              name: item.fallback_name || name,
              full_name: item.full_name,
              owner: { login: owner, avatar_url: `https://github.com/${owner}.png` },
              description: item.fallback_desc || '',
              stargazers_count: item.stars || 0,
              forks_count: item.forks || 0,
              language: item.language || 'Unknown',
              html_url: `https://github.com/${item.full_name}`,
              image: item.image ? `https://cms.sarjanakomputer.id/api/files/curated_repos/${item.id}/${item.image}` : null
            };
          });

        setRepos(filtered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchSearch();
  }, [query]);

  const isListView = viewMode === 'list';

  return (
    <div className="content-area">
      <div className="content-header">
        <h2 className="page-title">
          <Search size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
          Hasil Pencarian: "{query}"
        </h2>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {repos.length} repo ditemukan
        </div>
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
        <div className="loader"><h2>Mencari repositori...</h2></div>
      ) : error ? (
        <div className="error"><p>Error: {error}</p></div>
      ) : repos.length === 0 ? (
        <div className="empty-state">
          <p>Tidak ada repositori yang cocok dengan pencarian "{query}".</p>
        </div>
      ) : (
        <div className={isListView ? 'repo-list-container' : 'repo-grid'}>
          {repos.map(repo => 
            isListView ? (
              <RepoCardList key={repo.id} repo={repo} />
            ) : (
              <RepoCard key={repo.id} repo={repo} />
            )
          )}
        </div>
      )}
    </div>
  );
}
