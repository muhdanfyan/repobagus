export default async function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host || 'repo.sarjanakomputer.id'}`);
  const pathParts = url.pathname.split('/');
  
  // Expected path format: /repo/:owner/:name
  let owner = '';
  let name = '';
  
  // The Vercel rewrite masks the destination URL but passes path params or original URL 
  // actually in Vercel API routes you can get query params if mapped, but since we map destination simply to /api/bot-proxy
  // the req.url will likely still contain /repo/:owner/:name
  
  if (pathParts.length >= 4 && pathParts[1] === 'repo') {
    owner = pathParts[2];
    name = pathParts[3];
  } else if (req.query) {
      // In case Vercel passes them via query params when rewritten (sometimes it does depending on config)
      owner = req.query.owner;
      name = req.query.name;
  }
  
  if (!owner || !name) {
    // If we can't extract it, just fall back to standard HTML
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=/"></head></html>`);
    return;
  }
  
  const repoFullName = `${owner}/${name}`;
  const PB_URL = 'https://cms.sarjanakomputer.id';
  
  let imageUrl = `https://opengraph.githubassets.com/1/${owner}/${name}`;
  let title = `${name} - Sarjana Komputer`;
  let description = "Temukan dan eksplorasi repositori open-source terbaik. Kurasi alat pengembang, framework, dan referensi belajar dalam satu tempat.";
  
  try {
    // Check PocketBase for custom metadata
    const pbResponse = await fetch(`${PB_URL}/api/collections/curated_repos/records?filter=(full_name='${repoFullName}')`);
    if (pbResponse.ok) {
      const pbData = await pbResponse.json();
      if (pbData.items && pbData.items.length > 0) {
        const repo = pbData.items[0];
        if (repo.image) {
          imageUrl = `${PB_URL}/api/files/curated_repos/${repo.id}/${repo.image}`;
        }
        if (repo.fallback_desc) {
          description = repo.fallback_desc;
          if (description.length > 150) description = description.substring(0, 147) + '...';
        }
        if (repo.fallback_name) {
          title = `${repo.fallback_name} - Sarjana Komputer`;
        }
      }
    }
  } catch(e) {
    console.error('Failed to fetch from PB', e);
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://repo.sarjanakomputer.id/repo/${owner}/${name}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${imageUrl}">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://repo.sarjanakomputer.id/repo/${owner}/${name}">
    <meta property="twitter:title" content="${title}">
    <meta property="twitter:description" content="${description}">
    <meta property="twitter:image" content="${imageUrl}">
    
    <!-- Just in case a normal browser hits this due to misconfiguration -->
    <meta http-equiv="refresh" content="0;url=https://repo.sarjanakomputer.id/repo/${owner}/${name}">
</head>
<body>
    <p>Redirecting to <a href="https://repo.sarjanakomputer.id/repo/${owner}/${name}">https://repo.sarjanakomputer.id/repo/${owner}/${name}</a>...</p>
    <script>window.location.href = "https://repo.sarjanakomputer.id/repo/${owner}/${name}";</script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=43200');
  res.status(200).send(html);
}
