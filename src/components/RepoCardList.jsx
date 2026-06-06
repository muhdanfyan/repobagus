import React from 'react';
import { Star, GitFork, Circle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RepoCardList({ repo }) {
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

  const ogImageUrl = repo.image || `https://opengraph.githubassets.com/1/${repo.full_name}`;

  return (
    <Link to={`/repo/${repo.full_name}`} className="repo-list-item card">
      <div className="repo-list-thumb">
        <img src={ogImageUrl} alt={`${repo.name} thumbnail`} loading="lazy" />
      </div>
      <div className="repo-list-body">
        <div className="repo-list-header">
          <img src={repo.owner.avatar_url} alt={repo.owner.login} className="repo-list-avatar" />
          <div className="repo-list-title-group">
            <h3 className="repo-list-name">{repo.name}</h3>
            <p className="repo-list-author">{repo.owner.login}</p>
          </div>
        </div>
        <p className="repo-list-desc">
          {repo.description || 'No description provided for this repository.'}
        </p>
        <div className="repo-list-stats">
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
