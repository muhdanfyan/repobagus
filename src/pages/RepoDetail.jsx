import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, GitFork, ArrowLeft, ExternalLink, Globe, Circle, BookOpen, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function RepoDetail() {
  const { owner, repoName } = useParams();
  const [repo, setRepo] = useState(null);
  const [readme, setReadme] = useState('');
  const [translatedReadme, setTranslatedReadme] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch Repo Info
        let repoData;
        const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}`);
        if (!repoRes.ok) {
          if (repoRes.status === 403 || repoRes.status === 429) {
            console.warn('Rate limited on repo fetch, falling back to CMS data');
            // Fetch repos by owner to handle missing hyphens or case issues gracefully
            const cmsRes = await fetch(`https://cms.sarjanakomputer.id/api/collections/curated_repos/records?filter=full_name~'${owner}/'`);
            if (cmsRes.ok) {
              const cmsData = await cmsRes.json();
              let item = null;
              
              if (cmsData.items && cmsData.items.length > 0) {
                // Coba cari yang sama persis dulu (case-insensitive)
                item = cmsData.items.find(i => i.full_name.toLowerCase() === `${owner}/${repoName}`.toLowerCase());
                
                // Kalau tidak ada, cari dengan mengabaikan tanda hubung (hyphen)
                if (!item) {
                  const targetName = repoName.replace(/-/g, '').toLowerCase();
                  item = cmsData.items.find(i => {
                    const iName = i.full_name.split('/')[1].replace(/-/g, '').toLowerCase();
                    return iName === targetName;
                  });
                }
              }

              if (item) {
                const [realOwner, realRepo] = item.full_name.split('/');
                repoData = {
                  name: item.fallback_name || realRepo,
                  repo_name: realRepo, // Simpan nama asli repo
                  owner: { login: realOwner, avatar_url: `https://github.com/${realOwner}.png` },
                  description: item.fallback_desc || "Deskripsi tidak tersedia karena batas akses API GitHub harian tercapai.",
                  html_url: `https://github.com/${item.full_name}`,
                  homepage: item.website || '',
                  language: item.language || 'Unknown',
                  stargazers_count: item.stars || 0,
                  forks_count: item.forks || 0,
                  updated_at: item.updated || new Date().toISOString()
                };
              } else {
                throw new Error(`Data repositori '${repoName}' tidak ditemukan (Rate Limit GitHub tercapai & data tidak ada di CMS).`);
              }
            } else {
               throw new Error('Data repositori tidak dapat dimuat (Rate Limit GitHub tercapai).');
            }
          } else {
            throw new Error('Repository tidak ditemukan di GitHub.');
          }
        } else {
          repoData = await repoRes.json();
          repoData.repo_name = repoData.name; // Simpan nama asli dari GitHub API
        }
        setRepo(repoData);

        // Fetch website from CMS (fallback kalau GitHub homepage kosong)
        try {
          const cmsRes = await fetch(`https://cms.sarjanakomputer.id/api/collections/curated_repos/records?filter=full_name~'${owner}/${repoName}'&fields=website`);
          if (cmsRes.ok) {
            const cmsData = await cmsRes.json();
            if (cmsData.items && cmsData.items.length > 0 && cmsData.items[0].website) {
              repoData.homepage = cmsData.items[0].website;
              setRepo({...repoData});
            }
          }
        } catch (e) {
          console.warn('Gagal fetch website dari CMS:', e);
        }

        // Fetch Readme (Try raw CDN first to bypass API limits / "scraping" sendiri)
        let decodedReadme = '';
        let fetchSuccess = false;
        const rawBranches = ['main', 'master'];
        const rawFiles = ['README.md', 'readme.md', 'README.MD', 'Readme.md'];
        
        // Gunakan nama asli (realOwner & realRepo) yang bebas typo/case
        const fetchOwner = repoData.owner.login;
        const fetchRepo = repoData.repo_name;

        for (const branch of rawBranches) {
          if (fetchSuccess) break;
          for (const file of rawFiles) {
            try {
              const rawRes = await fetch(`https://raw.githubusercontent.com/${fetchOwner}/${fetchRepo}/${branch}/${file}`);
              if (rawRes.ok) {
                decodedReadme = await rawRes.text();
                fetchSuccess = true;
                break;
              }
            } catch (e) {
              // Ignore network errors on trial
            }
          }
        }

        if (!fetchSuccess) {
          // Fallback to API if raw URL guessing fails
          try {
            const apiRes = await fetch(`https://api.github.com/repos/${fetchOwner}/${fetchRepo}/readme`);
            if (apiRes.ok) {
              const readmeData = await apiRes.json();
              decodedReadme = atob(readmeData.content);
              fetchSuccess = true;
            } else if (apiRes.status === 403 || apiRes.status === 429) {
              // Rate limited on API too
              console.warn('Rate limited on README API fetch');
            }
          } catch (e) {
            console.error('Failed to fetch from API fallback', e);
          }
        }

        if (fetchSuccess && decodedReadme) {
          setReadme(decodedReadme);
          
          // Clean up HTML tags and comments before translating to avoid mangled markup
          const cleanText = decodedReadme.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]*>?/gm, '');
          
          // Translate to Indonesian (first 4500 chars to avoid limit)
          const textToTranslate = cleanText.slice(0, 4500);
          
          try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=id&dt=t&q=${encodeURIComponent(textToTranslate)}`;
            const translateRes = await fetch(url);
            const translateData = await translateRes.json();
            
            // translateData[0] is an array of translated segments
            const translatedText = translateData[0].map(item => item[0]).join('');
            setTranslatedReadme(translatedText);
          } catch (err) {
            console.error('Translation error:', err);
            setTranslatedReadme("Gagal menerjemahkan README (masalah jaringan/layanan).");
          }
        } else {
          setTranslatedReadme("⚠️ **Maaf, konten README tidak dapat ditampilkan saat ini.**\n\nHal ini umumnya disebabkan oleh dua kemungkinan:\n1. **Batas akses (Rate Limit) API GitHub** dari jaringan Anda telah tercapai untuk hari ini.\n2. **Repositori telah dihapus, dipindahkan, atau tidak memiliki file README** di GitHub.\n\nData metrik (bintang, bahasa) di samping berhasil dimuat dari *cache* sistem CMS kami untuk tetap memberikan informasi dasar kepada Anda.\n\nSilakan klik tombol **Lihat di GitHub** di atas untuk memeriksa status repositori ini secara langsung.");
          setReadme('');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [owner, repoName]);

  useEffect(() => {
    document.title = `${repoName} - Sarjana Komputer`;
    return () => {
      document.title = 'Sarjana Komputer';
    };
  }, [repoName]);

  const getLanguageColor = (lang) => {
    const colors = {
      JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
      HTML: '#e34c26', CSS: '#563d7c', Vue: '#41b883', Java: '#b07219',
      C: '#555555', 'C++': '#f34b7d',
    };
    return colors[lang] || '#8b949e';
  };

  if (loading) {
    return <div className="loader">Memuat data repositori...</div>;
  }

  if (error) {
    return <div className="content-area"><h2 style={{ color: 'red' }}>{error}</h2><Link to="/">Kembali</Link></div>;
  }

  return (
    <div className="content-area repo-detail-page">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} /> Kembali ke Beranda
      </Link>

      <div className="detail-header card glass-panel">
        <img src={repo.owner.avatar_url} alt={repo.owner.login} className="detail-avatar" />
        <div className="detail-header-info">
          <h1>{repo.name}</h1>
          <p>{repo.description}</p>
          <div className="detail-actions">
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <ExternalLink size={18} /> Lihat di GitHub
            </a>
            {repo.homepage && (
              <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                <Globe size={18} /> Website Utama
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="detail-layout">
        <div className="detail-main card">
          <h2><BookOpen size={20} /> Ringkasan README (Bahasa Indonesia)</h2>
          <div className="readme-content">
            {translatedReadme ? (
              <div className="markdown-body">
                <ReactMarkdown
                  components={{
                    pre(props) {
                      const { children, ...rest } = props;
                      const codeElement = React.Children.toArray(children)[0];
                      let textToCopy = '';
                      if (codeElement && codeElement.props && codeElement.props.children) {
                        textToCopy = String(codeElement.props.children).replace(/\n$/, '');
                      }
                      const codeKey = textToCopy || Math.random().toString();

                      return (
                        <div style={{ position: 'relative', margin: '1em 0' }} className="code-wrapper">
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(textToCopy);
                              setCopiedCode(codeKey);
                              setTimeout(() => setCopiedCode(null), 2000);
                            }}
                            style={{
                              position: 'absolute', right: '8px', top: '8px', 
                              background: '#2d2d2d', border: '1px solid #444', 
                              borderRadius: '4px', padding: '4px 8px', cursor: 'pointer',
                              color: '#e5e7eb', display: 'flex', alignItems: 'center', gap: '4px', zIndex: 10,
                              fontSize: '12px'
                            }}
                          >
                            {copiedCode === codeKey ? <><Check size={14} color="#4ade80" /> Disalin</> : <><Copy size={14} /> Salin</>}
                          </button>
                          <pre {...rest} style={{ padding: '2.5em 1em 1em', background: '#1e1e1e', color: '#d4d4d4', borderRadius: '8px', overflowX: 'auto', margin: 0 }}>
                            {children}
                          </pre>
                        </div>
                      );
                    }
                  }}
                >
                  {translatedReadme}
                </ReactMarkdown>
              </div>
            ) : (
              <p>Tidak ada README</p>
            )}
          </div>
        </div>

        <div className="detail-sidebar card">
          <h3>Informasi Repositori</h3>
          
          <div className="info-item">
            <span className="info-label">Pemilik</span>
            <span className="info-value">{repo.owner.login}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Bahasa Utama</span>
            <span className="info-value" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              {repo.language ? (
                <>
                  <span className="lang-dot" style={{ backgroundColor: getLanguageColor(repo.language) }}></span>
                  {repo.language}
                </>
              ) : 'Tidak diketahui'}
            </span>
          </div>

          <div className="info-item">
            <span className="info-label">Bintang</span>
            <span className="info-value" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Star size={14} color="#f59e0b" /> {repo.stargazers_count.toLocaleString()}
            </span>
          </div>

          <div className="info-item">
            <span className="info-label">Forks</span>
            <span className="info-value" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <GitFork size={14} color="var(--gray-500)" /> {repo.forks_count.toLocaleString()}
            </span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Lisensi</span>
            <span className="info-value">{repo.license ? repo.license.name : 'Tidak ada lisensi'}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Terakhir Diperbarui</span>
            <span className="info-value">{new Date(repo.updated_at).toLocaleDateString('id-ID')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
