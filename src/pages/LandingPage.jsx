import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Globe, Search as SearchIcon, BookOpen, Layers, LayoutGrid, List } from 'lucide-react';
import RepoCard from '../components/RepoCard';
import RepoCardList from '../components/RepoCardList';
import './LandingPage.css';

export default function LandingPage() {
  const [searchVal, setSearchVal] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allRepoNames, setAllRepoNames] = useState([]);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('repobagus_view_mode') || 'grid';
  });
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const landingSearchInputRef = useRef(null);
  const [searchParams] = useSearchParams();

  // Ambil semua data repo + nama untuk autocomplete
  useEffect(() => {
    Promise.all([
      fetch('https://cms.sarjanakomputer.id/api/collections/curated_repos/records?perPage=500')
        .then(r => r.json()),
      fetch('https://cms.sarjanakomputer.id/api/collections/curated_repos/records?perPage=500&fields=full_name,fallback_name,category')
        .then(r => r.json())
    ])
    .then(([data, nameData]) => {
      // Semua repo
      const all = data.items
        .filter(item => item.is_active !== false)
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
      setRepos(all.reverse());

      // Nama untuk autocomplete
      const names = nameData.items
        .filter(i => i.is_active !== false)
        .flatMap(i => [i.full_name, i.fallback_name, i.category].filter(Boolean));
      setAllRepoNames([...new Set(names)]);
    })
    .catch(() => {})
    .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search/${searchVal.trim()}`);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchVal(val);
    if (val.trim().length >= 1) {
      const matched = allRepoNames
        .filter(n => n.toLowerCase().includes(val.toLowerCase()))
        .slice(0, 8);
      setSuggestions(matched);
      setShowSuggestions(matched.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (s) => {
    setSearchVal(s);
    setShowSuggestions(false);
    navigate(`/search/${encodeURIComponent(s)}`);
  };

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Deteksi URL params: ?q= — langsung isi search + submit; ?focus=search — fokus ke input
  useEffect(() => {
    const q = searchParams.get('q');
    const focus = searchParams.get('focus');
    if (q) {
      setSearchVal(q);
      // Auto submit setelah state terupdate
      setTimeout(() => {
        navigate(`/search/${encodeURIComponent(q)}`, { replace: true });
      }, 100);
    } else if (focus === 'search' && landingSearchInputRef.current) {
      landingSearchInputRef.current.focus();
      // Bersihin URL
      navigate('/', { replace: true });
    }
  }, []);

  const toggleViewMode = (mode) => {
    setViewMode(mode);
    localStorage.setItem('repobagus_view_mode', mode);
  };

  const visibleRepos = repos.slice(0, visibleCount);
  const isListView = viewMode === 'list';

  return (
    <div className="landing-wrapper">
      {/* HERO SECTION */}
      <div className="landing-container">
        <div className="landing-hero">
          <h1 className="landing-title">Repo Sarjana Komputer</h1>
          <p className="landing-subtitle">
            Temukan dan eksplorasi repositori open-source terbaik. Kurasi koleksi alat pengembang, framework, dan referensi belajar dalam satu tempat.
          </p>

          {/* Search with Autocomplete */}
          <div className="landing-search-wrapper" ref={searchRef}>
            <form className="landing-search-form" onSubmit={handleSearch}>
              <SearchIcon size={20} className="landing-search-icon" />
              <input
                type="text"
                ref={landingSearchInputRef}
                className="landing-search-input"
                placeholder="Cari repositori, framework, atau bahasa..."
                value={searchVal}
                onChange={handleInputChange}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              />
              <button type="submit" className="landing-search-btn">Cari</button>
            </form>
            {showSuggestions && (
              <div className="landing-suggestions">
                {suggestions.map((s, i) => (
                  <div key={i} className="landing-suggestion-item" onClick={() => selectSuggestion(s)}>
                    <SearchIcon size={14} />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ALL REPOS SECTION */}
      <div className="landing-all-repos">
        <div className="landing-all-header">
          <h2>Semua Repositori</h2>
          <div className="view-toggle">
            <button 
              className={`view-toggle-btn ${!isListView ? 'active' : ''}`}
              onClick={() => toggleViewMode('grid')}
              aria-label="Grid view"
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              className={`view-toggle-btn ${isListView ? 'active' : ''}`}
              onClick={() => toggleViewMode('list')}
              aria-label="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loader"><h2>Memuat repositori...</h2></div>
        ) : repos.length === 0 ? (
          <div className="empty-state"><p>Belum ada repositori.</p></div>
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
            {repos.length > 10 && (
              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <Link 
                  to="/category/all"
                  className="btn-primary" 
                  style={{ margin: '0 auto', textDecoration: 'none', display: 'inline-block', fontSize: '1rem' }}
                >
                  Lihat Semua
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
