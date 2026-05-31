import React, { createContext, useState, useContext } from 'react';

const translations = {
  en: {
    searchPlaceholder: "Search repositories...",
    submitRepo: "Submit Repo",
    navTrending: "Trending",
    navTools: "Dev Tools",
    homeTitle: "Discover & Share Standout Repositories",
    homeSubtitle: "Explore a curated directory of the best open-source projects across the web.",
    catTrending: "Trending Repositories",
    catTools: "Developer Tools",
    searchResults: "Search Results",
    loading: "Loading Repository Data...",
    emptyState: "No curated repositories for this category yet.",
    toggleLang: "EN",
    langTooltip: "Switch to Indonesian"
  },
  id: {
    searchPlaceholder: "Cari repositori...",
    submitRepo: "Tambah Repo",
    navTrending: "Populer",
    navTools: "Alat Dev",
    homeTitle: "Temukan & Bagikan Repositori Terbaik",
    homeSubtitle: "Jelajahi direktori proyek sumber terbuka (open-source) pilihan yang paling menonjol dari seluruh web.",
    catTrending: "Repositori Populer",
    catTools: "Alat Developer",
    searchResults: "Hasil Pencarian",
    loading: "Memuat Data Repository...",
    emptyState: "Belum ada repository yang dikurasi untuk kategori ini.",
    toggleLang: "ID",
    langTooltip: "Switch to English"
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('id');

  const toggleLanguage = () => {
    setLang(prev => prev === 'id' ? 'en' : 'id');
  };

  const t = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
