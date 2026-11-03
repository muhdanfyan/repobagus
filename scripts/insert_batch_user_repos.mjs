import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const PB_URL = 'https://cms.sarjanakomputer.id';
const ADMIN_EMAIL = 'admin@sarjanakomputer.id';
const ADMIN_PASS = 'Piblajar2020';

const reposToInsert = [
  {
    full_name: 'emanuele-em/kanzo',
    fallback_name: 'kanzo',
    category: 'tools',
    fallback_desc: 'Kanzo adalah papan Kanban lokal yang dirancang khusus untuk developer dan AI agents. Bekerja secara offline dengan format file lokal, memudahkan pengelolaan task dan pelacakan progres pengembangan software secara cepat dan aman.',
    keywords: ['kanban', 'developer', 'ai-agent', 'productivity', 'rust', 'project-management']
  },
  {
    full_name: 'lightpanda-io/browser',
    fallback_name: 'browser',
    category: 'scraping',
    fallback_desc: 'Lightpanda adalah headless browser ultra-ringan yang dibangun dengan bahasa Zig untuk kebutuhan web automation, scraping, dan AI agents. Menggunakan resource memori yang jauh lebih kecil dan eksekusi jauh lebih cepat dibandingkan Chrome headless.',
    keywords: ['headless-browser', 'zig', 'scraping', 'automation', 'ai-agent', 'crawler']
  },
  {
    full_name: 'roryclear/clearcam',
    fallback_name: 'clearcam',
    category: 'ai',
    fallback_desc: 'Clearcam adalah sistem object detection dan tracking berbasis AI yang berjalan secara lokal untuk kamera pengawas RTSP. Memungkinkan pemantauan video real-time dengan privasi terjaga tanpa perlu mengirim stream ke server cloud.',
    keywords: ['computer-vision', 'object-detection', 'ai', 'rtsp', 'cctv', 'tracking']
  },
  {
    full_name: 'Donchitos/Claude-Code-Game-Studios',
    fallback_name: 'Claude-Code-Game-Studios',
    category: 'ai',
    fallback_desc: 'Claude Code Game Studios adalah framework orkestrasi multi-agent (49 agents) untuk pengembangan video game secara otomatis. Menggunakan Claude Code untuk membagi peran seperti game designer, programmer, tester, dan asset artist.',
    keywords: ['ai-agent', 'multi-agent', 'game-dev', 'claude-code', 'automation', 'ai']
  },
  {
    full_name: 'thtbee/nectarlink',
    fallback_name: 'nectarlink',
    category: 'tools',
    fallback_desc: 'NectarLink adalah aplikasi integrasi mulus antara perangkat Android dan PC Windows yang bekerja melalui jaringan lokal dengan enkripsi end-to-end. Memfasilitasi sinkronisasi notifikasi, clipboard, dan transfer file tanpa server pihak ketiga.',
    keywords: ['android', 'windows', 'clipboard', 'sync', 'local-network', 'privacy']
  },
  {
    full_name: 'aw-junaid/hacking-tools',
    fallback_name: 'Hacking-Tools',
    category: 'cybersecurity',
    fallback_desc: 'Hacking Tools adalah repositori komprehensif yang mengumpulkan berbagai utilitas dan tool penetration testing untuk ethical hacking, audit keamanan siber, dan pengujian kerentanan sistem.',
    keywords: ['penetration-testing', 'ethical-hacking', 'security', 'cybersecurity', 'infosec', 'audit']
  },
  {
    full_name: 'BuilderIO/mitosis',
    fallback_name: 'mitosis',
    category: 'frontend',
    fallback_desc: 'Mitosis adalah tool kompilasi multi-framework dari Builder.io yang memungkinkan developer menulis komponen UI sekali dan mengompilasinya ke berbagai frontend framework seperti React, Vue, Svelte, Qwik, Angular, dan Solid.',
    keywords: ['frontend', 'components', 'cross-framework', 'react', 'vue', 'svelte', 'typescript']
  },
  {
    full_name: 'jbiaojerry/ebook-treasure-chest',
    fallback_name: 'ebook-treasure-chest',
    category: 'edukasi',
    fallback_desc: 'Ebook Treasure Chest adalah repositori kurasi direktori dan sumber unduhan buku elektronik (ebook) berbagai topik pemrograman, ilmu komputer, sains, dan literatur umum yang dapat diakses bebas.',
    keywords: ['ebook', 'edukasi', 'buku', 'resource', 'download', 'literatur']
  },
  {
    full_name: 'debpalash/VoiceStudio',
    fallback_name: 'VoiceStudio',
    category: 'ai',
    fallback_desc: 'VoiceStudio adalah alternatif lokal dan offline untuk ElevenLabs yang mendukung voice cloning, text-to-speech (TTS), dan dubbing audio berkualitas tinggi menggunakan model AI sumber terbuka tanpa biaya langganan.',
    keywords: ['voice-cloning', 'tts', 'text-to-speech', 'audio', 'ai', 'elevenlabs-alternative']
  },
  {
    full_name: 'bilawalsidhu/gods-eye-view',
    fallback_name: 'gods-eye-view',
    category: 'frontend',
    fallback_desc: 'God\'s Eye View adalah aplikasi web 3D globe interaktif berbasis CesiumJS dan WebGL untuk memvisualisasikan data pengawasan publik, sensor, satelit, dan pelacakan global secara visual dan real-time di atas bola dunia digital.',
    keywords: ['cesium', 'webgl', '3d-globe', 'geospatial', 'visualization', 'tracking']
  },
  {
    full_name: 'pass-with-high-score/blockads-android',
    fallback_name: 'blockads-android',
    category: 'tools',
    fallback_desc: 'BlockAds Android adalah pemblokir iklan (adblocker) tingkat sistem untuk Android yang bekerja secara lokal melalui mekanisme VPN dan DNS lokal tanpa memerlukan akses root, menjaga privasi dan menghemat kuota data.',
    keywords: ['adblocker', 'android', 'vpn', 'dns', 'privacy', 'security']
  },
  {
    full_name: 'lnkiai/m3e-canvas',
    fallback_name: 'm3e-canvas',
    category: 'frontend',
    fallback_desc: 'M3E Canvas adalah kanvas sketsa UI berbasis Material 3 Expressive yang secara otomatis mengonversi sketsa antarmuka pengguna menjadi prompt AI siap pakai untuk pembuatan kode frontend.',
    keywords: ['material-3', 'ui-sketch', 'canvas', 'ai-prompt', 'frontend', 'design-to-code']
  },
  {
    full_name: 'westpoint-io/mimik',
    fallback_name: 'mimik',
    category: 'tools',
    fallback_desc: 'Mimik adalah ekstensi browser yang merekam setiap klik dan alur kerja di web browser, lalu secara otomatis menghasilkan panduan step-by-step lengkap dengan tangkapan layar untuk dokumentasi atau tutorial.',
    keywords: ['browser-extension', 'workflow-recorder', 'documentation', 'guide-generator', 'tools']
  }
];

async function run() {
  console.log('=== STEP 1: Getting GitHub Token ===');
  let ghToken = '';
  try {
    ghToken = execSync('gh auth token').toString().trim();
  } catch (e) {
    console.log('No gh auth token found, proceeding with unauthenticated requests');
  }

  console.log('=== STEP 2: Authenticating with PocketBase CMS ===');
  const authRes = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASS }),
  });

  if (!authRes.ok) {
    throw new Error(`PocketBase login failed: ${await authRes.text()}`);
  }
  const { token: pbToken } = await authRes.json();
  console.log('PocketBase login successful!');

  console.log('=== STEP 3: Processing Repositories ===');
  const results = [];

  for (const item of reposToInsert) {
    console.log(`\nProcessing: ${item.full_name}...`);

    let ghData = {};
    try {
      const headers = { 'User-Agent': 'repobagus-curator' };
      if (ghToken) headers['Authorization'] = `Bearer ${ghToken}`;
      const ghRes = await fetch(`https://api.github.com/repos/${item.full_name}`, { headers });
      if (ghRes.ok) {
        ghData = await ghRes.json();
        console.log(`  Fetched GitHub data: Stars=${ghData.stargazers_count}, Forks=${ghData.forks_count}, Lang=${ghData.language}`);
      } else {
        console.warn(`  GitHub API response ${ghRes.status} for ${item.full_name}`);
      }
    } catch (e) {
      console.error(`  Failed to fetch GitHub data: ${e.message}`);
    }

    const payload = {
      full_name: item.full_name,
      fallback_name: ghData.name || item.fallback_name,
      category: item.category,
      fallback_desc: item.fallback_desc,
      stars: ghData.stargazers_count ?? 0,
      forks: ghData.forks_count ?? 0,
      language: ghData.language || 'Unknown',
      website: ghData.homepage || '',
      image: '',
      is_active: true,
      keywords: item.keywords
    };

    // Check if record exists
    const checkRes = await fetch(`${PB_URL}/api/collections/curated_repos/records?filter=${encodeURIComponent(`full_name='${item.full_name}'`)}`, {
      headers: { 'Authorization': pbToken }
    });
    const checkData = await checkRes.json();

    if (checkData.items && checkData.items.length > 0) {
      const recordId = checkData.items[0].id;
      const patchRes = await fetch(`${PB_URL}/api/collections/curated_repos/records/${recordId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': pbToken
        },
        body: JSON.stringify(payload)
      });
      if (patchRes.ok) {
        console.log(`  Updated existing record ${recordId} in PocketBase.`);
        results.push({ name: item.full_name, status: 'updated' });
      } else {
        console.error(`  Failed to update record: ${await patchRes.text()}`);
      }
    } else {
      const createRes = await fetch(`${PB_URL}/api/collections/curated_repos/records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': pbToken
        },
        body: JSON.stringify(payload)
      });
      if (createRes.ok) {
        const createdRecord = await createRes.json();
        console.log(`  Created new record ${createdRecord.id} in PocketBase.`);
        results.push({ name: item.full_name, status: 'created', id: createdRecord.id });
      } else {
        console.error(`  Failed to create record: ${await createRes.text()}`);
      }
    }
  }

  console.log('\n=== Summary of PocketBase Insertion ===');
  console.table(results);

  console.log('\n=== STEP 4: Syncing to local src/data/repos.json ===');
  try {
    const listRes = await fetch(`${PB_URL}/api/collections/curated_repos/records?perPage=500`);
    if (listRes.ok) {
      const allData = await listRes.json();
      const mapped = allData.items.map(item => ({
        fullName: item.full_name,
        category: item.category,
        name: item.fallback_name || item.full_name.split('/')[1],
        description: item.fallback_desc || '',
        stargazers_count: item.stars || 0,
        forks_count: item.forks || 0,
        language: item.language || ''
      }));

      const reposJsonPath = path.join(process.cwd(), 'src/data/repos.json');
      fs.writeFileSync(reposJsonPath, JSON.stringify(mapped, null, 2));
      console.log(`Successfully synced ${mapped.length} repos to src/data/repos.json!`);
    }
  } catch (err) {
    console.error('Failed to sync to local repos.json:', err.message);
  }
}

run().catch(console.error);

