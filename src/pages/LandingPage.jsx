import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Search, BookOpen, Layers } from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing-wrapper">
      <div className="landing-container">
        <div className="landing-hero">
          <h1 className="landing-title">Selamat Datang di Repo Sarjana Komputer</h1>
        <p className="landing-subtitle">
          Temukan dan eksplorasi repositori open-source terbaik. Kurasi koleksi alat pengembang, framework, dan referensi belajar dalam satu tempat.
        </p>
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
