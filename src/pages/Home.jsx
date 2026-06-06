import React from 'react';
import { useParams } from 'react-router-dom';
import RepoList from '../components/RepoList';

export default function Home() {
  const { categoryId } = useParams();
  
  const categoryTitles = {
    'trending': 'Repositori Populer',
    'all': 'Semua Repositori',
    'smart-city': 'Smart City & IoT',
    'cms': 'CMS & ERP',
    'frontend': 'Pengembangan Frontend',
    'backend': 'Pengembangan Backend',
    'ai': 'AI & Machine Learning',
    'scraping': 'Alat Web Scraping',
    'cybersecurity': 'Alat Cyber Security',
    'tools': 'Alat Developer'
  };

  const currentCategory = categoryId || 'trending';
  const title = categoryTitles[currentCategory] || 'Hasil Pencarian';

  return (
    <>
      <RepoList categoryId={currentCategory} title={title} />
    </>
  );
}
