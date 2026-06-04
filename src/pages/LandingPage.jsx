import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Search as SearchIcon, BookOpen, Layers } from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
  const [searchVal, setSearchVal] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allRepoNames, setAllRepoNames] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Ambil semua nama repo untuk autocomplete
  useEffect(() => {
    fetch('https://cms.sarjanakomputer.id/api/collections/curated_repos/records?perPage=500&fields=full_name,fallback_name,category')
      .then(r => r.json())
      .then(d => {
        const names = d.items
          .filter(i => i.is_active !== false)
          .flatMap(i => [i.full_name, i.fallback_name, i.category].filter(Boolean));
        setAllRepoNames([...new Set(names)]);
      })
      .catch(() => {});
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

  // Tutup dropdown klik di luar
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="landing-wrapper">
      <div className="landing-container">
        <div className="landing-hero">
          <h1 className="landing-title">Selamat Datang di Repo Sarjana Komputer</h1>
        <p className="landing-subtitle">
          Temukan dan eksplorasi repositori open-source terbaik. Kurasi koleksi alat pengembang, framework, dan referensi belajar dalam satu tempat.
        </p>

        {/* Search Bar with Autocomplete */}
        <div className="landing-search-wrapper" ref={searchRef}>
          <form className="landing-search-form" onSubmit={handleSearch}>
            <SearchIcon size={20} className="landing-search-icon" />
            <input
              type="text"
              className="landing-search-input"
              placeholder="Cari repositori, framework, atau bahasa..."
              value={searchVal}
              onChange={handleInputChange}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            />
            <button type="submit" className="landing-search-btn">
              Cari
            </button>
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

        <div className="landing-cta">
          <Link to="/category/trending" className="btn-primary">
            Telusuri Repository
          </Link>
        </div>
      </div>
      
      <div className="landing-features">
        <div className="feature-card">
          <Search size={32} className="feature-icon" />
          <h3>Pencarian Cepat</h3>
          <p>Temukan repositori berdasarkan kategori, bahasa, atau nama dengan mudah.</p>
        </div>
        <div className="feature-card">
          <Layers size={32} className="feature-icon" />
          <h3>Kategori Lengkap</h3>
          <p>Mulai dari Frontend, Backend, AI, hingga Cybersecurity, semua terkurasi rapi.</p>
        </div>
        <div className="feature-card">
          <BookOpen size={32} className="feature-icon" />
          <h3>Sumber Belajar</h3>
          <p>Akses berbagai referensi dan buku pemrograman open-source pilihan.</p>
        </div>
        <div className="feature-card">
          <Globe size={32} className="feature-icon" />
          <h3>Sumber Open-Source</h3>
          <p>Data diambil langsung dari repositori open source untuk memastikan informasi selalu up-to-date.</p>
        </div>
      </div>
    </div>
    </div>
  );
}
