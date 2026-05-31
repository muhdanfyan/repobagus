import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flame, Star, Code, Terminal, Brain, Layers, Globe, Shield, BookOpen } from 'lucide-react';

const categories = [
  { id: 'trending', name: 'Populer', icon: Flame, query: 'stars:>1000' },
  { id: 'frontend', name: 'Frontend', icon: Layers, query: 'topic:frontend' },
  { id: 'backend', name: 'Backend', icon: Terminal, query: 'topic:backend' },
  { id: 'ai', name: 'AI & ML', icon: Brain, query: 'topic:machine-learning' },
  { id: 'scraping', name: 'Web Scraping', icon: Globe, query: 'topic:web-scraping' },
  { id: 'cybersecurity', name: 'Cyber Security', icon: Shield, query: 'topic:security' },
  { id: 'edukasi', name: 'Edukasi', icon: BookOpen, query: 'topic:education' },
  { id: 'tools', name: 'Alat Dev', icon: Star, query: 'topic:developer-tools' },
];

export default function Sidebar({ onItemClick }) {
  const handleClick = () => {
    if (onItemClick) onItemClick();
  };

  return (
    <nav className="header-nav">
      {categories.map((cat) => (
        <NavLink 
          key={cat.id} 
          to={`/category/${cat.id}`}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          onClick={handleClick}
        >
          <cat.icon size={18} />
          {cat.name}
        </NavLink>
      ))}
    </nav>
  );
}
