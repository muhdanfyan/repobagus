import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';

export default function Header() {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      // Navigasi langsung ke halaman search dengan hasil
      navigate(`/search/${encodeURIComponent(search.trim())}`);
      setSearchOpen(false);
      setSearch('');
    }
  };

  const focusLandingSearch = () => {
    navigate('/?focus=search');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header-container glass-panel">
      <div className="header-top">
        <button 
          className="menu-toggle" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <a href="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <img src="https://sarjanakomputer.id/images/logo.png" alt="SKI Logo" style={{ width: '32px', height: '32px', borderRadius: '6px' }} />
          <div className="brand-text" style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.15' }}>
            <span className="news-label" style={{ fontSize: '0.5rem', fontWeight: 700, color: 'var(--secondary)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '-1px' }}>
              Repository
            </span>
            <span className="brand-name" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, color: 'var(--dark)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
              Sarjana<span style={{ color: 'var(--secondary)' }}>Komputer</span>
            </span>
          </div>
        </a>

        {/* Search - Desktop: klik submit atau enter → fokus ke search landing */}
        <form className="search-bar search-bar-desktop" onSubmit={handleSearch}>
          <Search size={18} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Cari repositori..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        {/* Search - Mobile Toggle */}
        <button className="search-mobile-toggle" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
          <Search size={20} />
        </button>
      </div>

      {/* Search Bar - Mobile Expanded */}
      {searchOpen && (
        <form className="search-bar search-bar-mobile" onSubmit={handleSearch}>
          <Search size={18} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Cari repositori..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <button type="button" className="search-close" onClick={() => setSearchOpen(false)}>
            <X size={18} />
          </button>
        </form>
      )}

      {/* Sidebar Desktop */}
      <div className="sidebar-desktop">
        <Sidebar />
      </div>

      {/* Sidebar Mobile Drawer */}
      {menuOpen && (
        <div className="mobile-drawer-overlay" onClick={closeMenu}>
          <div className="mobile-drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <span className="drawer-title">Kategori</span>
              <button className="drawer-close" onClick={closeMenu}>
                <X size={20} />
              </button>
            </div>
            <Sidebar onItemClick={closeMenu} />
          </div>
        </div>
      )}
    </header>
  );
}
