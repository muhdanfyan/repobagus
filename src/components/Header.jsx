import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Menu, X, LogIn } from 'lucide-react';
import Sidebar from './Sidebar';

export default function Header() {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      // Navigate ke landing page — akan auto-focus ke search input
      navigate(`/?q=${encodeURIComponent(search.trim())}`);
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

        <button className="btn-primary btn-login" onClick={() => setIsLoginModalOpen(true)}>
          <LogIn size={18} />
          <span className="login-text">Login</span>
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

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="modal-overlay" onClick={() => setIsLoginModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Pilih Metode Login</h3>
              <button className="close-btn" onClick={() => setIsLoginModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem 0 0.5rem' }}>
              <button className="btn-primary" style={{ backgroundColor: '#fff', color: '#333', border: '1px solid #ddd', width: '100%', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  <path fill="none" d="M0 0h48v48H0z"/>
                </svg>
                Login with Google
              </button>
              <button className="btn-primary" style={{ backgroundColor: '#24292e', color: '#fff', border: '1px solid #24292e', width: '100%', justifyContent: 'center' }}>
                <svg height="18" width="18" viewBox="0 0 16 16" version="1.1" aria-hidden="true" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
                Login with GitHub
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
