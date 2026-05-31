import React from 'react';
import { Star, GitFork, Circle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RepoCard({ repo }) {
  // Try to generate a nice color based on language
  const getLanguageColor = (lang) => {
    const colors = {
      JavaScript: '#f1e05a',
      TypeScript: '#3178c6',
      Python: '#3572A5',
      HTML: '#e34c26',
      CSS: '#563d7c',
      Vue: '#41b883',
      Java: '#b07219',
      C: '#555555',
      'C++': '#f34b7d',
    };
    return colors[lang] || '#8b949e';
  };

  const ogImageUrl = repo.image || `https://opengraph.githubassets.com/1/${repo.owner.login}/${repo.name}`;

  return (
    <Link to={`/repo/${repo.owner.login}/${repo.name}`} className="card repo-card">
      <div className="repo-thumbnail">
        <img src={ogImageUrl} alt={`${repo.name} thumbnail`} loading="lazy" />
      </div>
      <div className="repo-card-content">
        <div className="repo-header">
          <img src={repo.owner.avatar_url} alt={repo.owner.login} className="repo-avatar" />
          <div>
            <h3 className="repo-name">{repo.name}</h3>
            <p className="repo-author">{repo.owner.login}</p>
          </div>
        </div>
        
        <p className="repo-desc">
          {repo.description || 'No description provided for this repository.'}
        </p>

        <div className="repo-stats">
          {repo.language && (
            <div className="stat-item">
              <span 
                className="lang-dot" 
                style={{ backgroundColor: getLanguageColor(repo.language) }}
              ></span>
              {repo.language}
            </div>
          )}
          <div className="stat-item">
            <Star size={14} />
            {repo.stargazers_count.toLocaleString()}
          </div>
          <div className="stat-item">
            <GitFork size={14} />
            {repo.forks_count.toLocaleString()}
          </div>
        </div>
      </div>
    </Link>
  );
}
