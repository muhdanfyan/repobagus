const fs = require('fs');

const dataToSeed = {
  "facebook/react": {
    name: "react",
    description: "React adalah library JavaScript open-source yang sangat populer untuk membangun antarmuka pengguna (UI). Cara kerjanya menggunakan pendekatan berbasis komponen dan Virtual DOM, sehingga perubahan data pada web dapat dirender secara sangat cepat tanpa harus me-refresh seluruh halaman.",
    stargazers_count: 220000,
    forks_count: 45000,
    language: "JavaScript",
    owner: { login: "facebook", avatar_url: "https://avatars.githubusercontent.com/u/69631?v=4" }
  },
  "vuejs/vue": {
    name: "vue",
    description: "Vue.js adalah framework JavaScript progresif untuk membangun antarmuka pengguna. Berbeda dengan React, Vue didesain agar sangat mudah disisipkan ke proyek yang sudah ada. Ia menggunakan template HTML standar dan sistem reaktif yang langsung melacak perubahan data ke elemen visual.",
    stargazers_count: 205000,
    forks_count: 34000,
    language: "TypeScript",
    owner: { login: "vuejs", avatar_url: "https://avatars.githubusercontent.com/u/6128107?v=4" }
  },
  "pallets/flask": {
    name: "flask",
    description: "Flask adalah framework web micro untuk Python. Dinamakan 'micro' karena inti framework ini sangat sederhana namun mudah diperluas (extensible). Flask sangat cocok untuk membangun REST API backend atau aplikasi web kecil hingga menengah tanpa banyak aturan ketat.",
    stargazers_count: 65000,
    forks_count: 15000,
    language: "Python",
    owner: { login: "pallets", avatar_url: "https://avatars.githubusercontent.com/u/16748505?v=4" }
  },
  "huggingface/transformers": {
    name: "transformers",
    description: "Transformers adalah pustaka AI terkemuka untuk Natural Language Processing (NLP), Computer Vision, dan Audio. Ini menyediakan arsitektur ribuan model pra-latih (seperti BERT, GPT, T5) untuk teks, gambar, dan suara. Cara kerjanya menyederhanakan proses download dan pemakaian model AI dalam beberapa baris kode.",
    stargazers_count: 125000,
    forks_count: 24000,
    language: "Python",
    owner: { login: "huggingface", avatar_url: "https://avatars.githubusercontent.com/u/25720743?v=4" }
  },
  "vitejs/vite": {
    name: "vite",
    description: "Vite (dibaca 'vit') adalah build tool frontend modern yang memberikan pengalaman pengembangan yang sangat cepat. Cara kerjanya memanfaatkan native ES modules di browser untuk menyajikan kode tanpa bundling saat masa *development*, lalu menggunakan Rollup untuk *bundling* produksi yang optimal.",
    stargazers_count: 63000,
    forks_count: 6000,
    language: "TypeScript",
    owner: { login: "vitejs", avatar_url: "https://avatars.githubusercontent.com/u/65625612?v=4" }
  },
  "vercel/next.js": {
    name: "next.js",
    description: "Next.js adalah framework React untuk produksi. Framework ini memungkinkan fitur Server-Side Rendering (SSR) dan Static Site Generation (SSG), sehingga aplikasi React menjadi jauh lebih SEO-friendly dan cepat saat pertama kali dimuat. Dikelola langsung oleh Vercel.",
    stargazers_count: 118000,
    forks_count: 25000,
    language: "TypeScript",
    owner: { login: "vercel", avatar_url: "https://avatars.githubusercontent.com/u/14985020?v=4" }
  },
  "django/django": {
    name: "django",
    description: "Django adalah framework web Python tingkat tinggi yang dirancang untuk pengembangan cepat dan desain bersih. Berbeda dengan Flask yang 'micro', Django sudah mencakup hampir semua fitur bawaan (ORM, Admin Panel, Autentikasi) yang siap pakai alias 'batteries-included'.",
    stargazers_count: 76000,
    forks_count: 31000,
    language: "Python",
    owner: { login: "django", avatar_url: "https://avatars.githubusercontent.com/u/27804?v=4" }
  },
  "langchain-ai/langchain": {
    name: "langchain",
    description: "LangChain adalah framework untuk mengembangkan aplikasi yang ditenagai oleh model bahasa besar (LLMs). Cara kerjanya adalah dengan merangkai (chaining) berbagai komponen AI (prompt, LLM, eksternal API) sehingga AI tidak hanya membalas chat, tapi bisa mengeksekusi instruksi kompleks.",
    stargazers_count: 82000,
    forks_count: 12000,
    language: "Python",
    owner: { login: "langchain-ai", avatar_url: "https://avatars.githubusercontent.com/u/126733545?v=4" }
  },
  "prettier/prettier": {
    name: "prettier",
    description: "Prettier adalah code formatter yang sangat teropini (opinionated). Cara kerjanya mem-parsing kode Anda dan mencetak ulangnya dengan seperangkat aturan konsisten, sehingga seluruh anggota tim secara otomatis memiliki gaya penulisan kode yang sama persis tanpa perlu berdebat.",
    stargazers_count: 48000,
    forks_count: 4000,
    language: "JavaScript",
    owner: { login: "prettier", avatar_url: "https://avatars.githubusercontent.com/u/25822731?v=4" }
  },
  "tailwindlabs/tailwindcss": {
    name: "tailwindcss",
    description: "Tailwind CSS adalah framework CSS berbasis utilitas (utility-first). Cara kerjanya adalah dengan menyediakan ribuan class kecil (seperti 'flex', 'pt-4', 'text-center') langsung di HTML, sehingga developer dapat membangun desain modern tanpa pernah menyentuh atau menulis file CSS eksternal secara manual.",
    stargazers_count: 75000,
    forks_count: 4000,
    language: "CSS",
    owner: { login: "tailwindlabs", avatar_url: "https://avatars.githubusercontent.com/u/67109815?v=4" }
  }
};

const filePath = './src/data/repos.json';
const repos = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

for (let i = 0; i < repos.length; i++) {
  const repo = repos[i];
  if (dataToSeed[repo.fullName]) {
    Object.assign(repo, dataToSeed[repo.fullName]);
  }
}

fs.writeFileSync(filePath, JSON.stringify(repos, null, 2));
console.log('Batch 1 seeded successfully!');
