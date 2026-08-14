#!/usr/bin/env bash
# smoke_test.sh — Pengecekan otomatis produksi (tanpa AI model).
# Cek: situs utama 200, CMS 200, dan bundle JS terbaru benar-benar termuat.
#
# Usage: bash scripts/smoke_test.sh
# Exit 0 = semua OK, 1 = ada yang gagal.

set -u

SITE_URL="https://repo.sarjanakomputer.id"
CMS_URL="https://cms.sarjanakomputer.id"
FAIL=0

echo "=== SMOKE TEST repo.sarjanakomputer.id ==="
echo "Waktu: $(date -u +%Y-%m-%dT%H:%M:%SZ)"

# 1. Cek HTTP status situs utama
site_status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 "$SITE_URL" || echo "000")
if [ "$site_status" = "200" ]; then
  echo "PASS: $SITE_URL -> HTTP $site_status"
else
  echo "FAIL: $SITE_URL -> HTTP $site_status (harus 200)"
  FAIL=1
fi

# 2. Cek HTTP status CMS
cms_status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 "$CMS_URL" || echo "000")
if [ "$cms_status" = "200" ]; then
  echo "PASS: $CMS_URL -> HTTP $cms_status"
else
  echo "FAIL: $CMS_URL -> HTTP $cms_status (harus 200)"
  FAIL=1
fi

# 3. Cek bundle JS terbaru dimuat
html=$(curl -s --max-time 30 "$SITE_URL" || true)
bundle=$(printf '%s' "$html" | grep -o 'assets/index-[^"]*\.js' | head -1)
if [ -n "$bundle" ]; then
  bundle_url="$SITE_URL/$bundle"
  bundle_status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 "$bundle_url" || echo "000")
  if [ "$bundle_status" = "200" ]; then
    echo "PASS: bundle JS termuat ($bundle -> HTTP $bundle_status)"
  else
    echo "FAIL: bundle JS $bundle_url -> HTTP $bundle_status (harus 200)"
    FAIL=1
  fi
else
  echo "FAIL: tidak menemukan assets/index-*.js di HTML $SITE_URL"
  FAIL=1
fi

# 4. Cek API CMS mengembalikan data curated_repos
api_status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 "$CMS_URL/api/collections/curated_repos/records?perPage=1" || echo "000")
if [ "$api_status" = "200" ]; then
  echo "PASS: CMS API curated_repos -> HTTP $api_status"
else
  echo "FAIL: CMS API curated_repos -> HTTP $api_status (harus 200)"
  FAIL=1
fi

echo ""
if [ "$FAIL" -eq 0 ]; then
  echo "RINGKASAN: PASS — semua pengecekan OK (exit 0)"
  exit 0
else
  echo "RINGKASAN: FAIL — ada pengecekan gagal (exit 1)"
  exit 1
fi
