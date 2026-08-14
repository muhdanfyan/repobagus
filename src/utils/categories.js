/**
 * Util normalisasi kategori — CMS punya 35+ label kategori yang tidak konsisten
 * (ai, AI, AI Tools, AI Agent CLI, education, edukasi, security, Security, dll).
 * Mapping ini menyatukan semua varian ke 8 kategori sidebar.
 */

export const SIDEBAR_CATEGORIES = [
  'trending', 'frontend', 'backend', 'ai',
  'scraping', 'cybersecurity', 'edukasi', 'tools', 'cms', 'all'
];

const CATEGORY_MAP = {
  // AI & Machine Learning
  'ai': 'ai',
  'AI': 'ai',
  'AI & ML': 'ai',
  'AI Tools': 'ai',
  'AI Agent': 'ai',
  'AI Agent CLI': 'ai',
  'ai-cli': 'ai',
  'ai-ml': 'ai',
  'Machine Learning': 'ai',
  'coding-agent': 'ai',
  'multi-agent': 'ai',
  'mcp-skills': 'ai',
  'skills-sh': 'ai',
  // Frontend
  'frontend': 'frontend',
  'Web Framework': 'frontend',
  // Backend
  'backend': 'backend',
  'devops': 'backend',
  'Network Management': 'backend',
  'python': 'backend',
  // Web Scraping
  'scraping': 'scraping',
  // Cyber Security
  'cybersecurity': 'cybersecurity',
  'security': 'cybersecurity',
  'Security': 'cybersecurity',
  'keamanan': 'cybersecurity',
  // Edukasi
  'edukasi': 'edukasi',
  'education': 'edukasi',
  'resources': 'edukasi',
  // Tools / Alat Dev
  'tools': 'tools',
  'developer-tools': 'tools',
  'self-hosted': 'tools',
  'unit-testing': 'tools',
  'Productivity': 'tools',
  'mobile': 'tools',
  'lainnya': 'tools',
  // CMS & ERP (halaman khusus, tidak di sidebar)
  'cms': 'cms'
};

export function normalizeCategory(cat) {
  if (!cat) return null;
  const key = String(cat).trim();
  return CATEGORY_MAP[key] || null;
}

export function sanitizeKeywords(keywords) {
  return Array.isArray(keywords) ? keywords : [];
}
