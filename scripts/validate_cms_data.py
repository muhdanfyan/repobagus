#!/usr/bin/env python3
"""
validate_cms_data.py — Validasi data CMS curated_repos PocketBase (tanpa dependency).

Cek per record:
  - full_name harus format "owner/repo" (mengandung '/')
  - keywords harus list/array (bukan string/null)
  - stars & forks harus angka (int/float)
  - is_active harus boolean
  - category harus ada (string tidak kosong)

Usage:
  python3 scripts/validate_cms_data.py

Exit code:
  0 = semua bersih
  1 = ada record bermasalah
"""
import json
import sys
import urllib.request

CMS_URL = "https://cms.sarjanakomputer.id/api/collections/curated_repos/records?perPage=500"


def fetch_json(url, timeout=30):
    req = urllib.request.Request(url, headers={"User-Agent": "repobagus-validator"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main():
    try:
        data = fetch_json(CMS_URL)
    except Exception as e:
        print(f"FAIL: Gagal fetch CMS ({e})")
        sys.exit(1)

    items = data.get("items", [])
    if not items:
        print(f"FAIL: Tidak ada record ditemukan (items kosong). totalItems={data.get('totalItems')}")
        sys.exit(1)

    problems = []
    skipped_inactive = 0
    for rec in items:
        rid = rec.get("id", "?")
        full_name = rec.get("full_name")
        is_active = rec.get("is_active")
        issues = []

        # Record non-aktif tidak ditampilkan di produksi → tidak wajib format owner/repo
        if is_active is False:
            skipped_inactive += 1
            continue

        # 1. full_name harus format owner/repo
        if not full_name or not isinstance(full_name, str):
            issues.append("full_name kosong/bukan string")
        elif "/" not in full_name:
            issues.append(f"full_name tanpa slash: '{full_name}'")
        elif full_name.startswith("/") or full_name.endswith("/"):
            issues.append(f"full_name format salah: '{full_name}'")

        # 2. keywords harus list
        kw = rec.get("keywords")
        if not isinstance(kw, list):
            issues.append(f"keywords bukan array (type={type(kw).__name__})")

        # 3. stars & forks harus angka
        for field in ("stars", "forks"):
            val = rec.get(field)
            if val is None or isinstance(val, bool) or not isinstance(val, (int, float)):
                issues.append(f"{field} bukan angka (value={val!r})")

        # 4. is_active harus boolean
        if not isinstance(rec.get("is_active"), bool):
            issues.append(f"is_active bukan boolean (value={rec.get('is_active')!r})")

        # 5. category harus ada
        cat = rec.get("category")
        if not cat or not isinstance(cat, str) or not cat.strip():
            issues.append(f"category kosong (value={cat!r})")

        if issues:
            problems.append((rid, full_name, issues))

    print(f"INFO: Total record di CMS: {len(items)} (aktif: {len(items) - skipped_inactive}, non-aktif: {skipped_inactive})")

    if problems:
        print(f"\nFAIL: {len(problems)} record aktif bermasalah dari {len(items) - skipped_inactive} total aktif:\n")
        for rid, full_name, issues in problems:
            print(f"  - [{rid}] {full_name}")
            for issue in issues:
                print(f"      * {issue}")
        print("\nRINGKASAN: FAIL (ada masalah, exit code 1)")
        sys.exit(1)

    print("\nRINGKASAN: PASS — semua record aktif valid (exit code 0)")
    sys.exit(0)


if __name__ == "__main__":
    main()
