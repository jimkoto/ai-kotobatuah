# Panduan Deploy Langsung ke Cloudflare Pages (Tanpa GitHub Terlebih Dahulu)

Struktur folder proyek ini sudah siap untuk langsung di-deploy ke **Cloudflare Pages + Cloudflare Pages Functions**:
- `dist/` -> hasil build frontend React + Tailwind (`npm run build`) termasuk `/favicon.svg`, `/robots.txt`, `/sitemap.xml`, dan `/_headers`.
- `functions/api/chat.ts` -> Edge Function `/api/chat` untuk chatbot **KotoAI** (ID/EN).
- `functions/api/health.ts` -> Edge Function `/api/health`.
- `wrangler.toml` -> konfigurasi Cloudflare Pages (`pages_build_output_dir = "dist"`).

## Langkah 1: Build Aplikasi Secara Lokal
```bash
npm install
npm run build
```
Perintah ini menghasilkan folder `dist/` yang siap tayang.

## Langkah 2: Login & Buat Proyek Cloudflare Pages
```bash
npx wrangler login
npx wrangler pages project create kotobatuah --production-branch main
```

## Langkah 3: Pasang Secret `GEMINI_API_KEY` di Cloudflare Pages
Agar chatbot **KotoAI** di `/api/chat` aktif secara aman di sisi server:
```bash
npx wrangler pages secret put GEMINI_API_KEY --project-name kotobatuah
```
(Tempelkan API Key Gemini Anda saat diminta.)

## Langkah 4: Deploy Langsung ke Cloudflare Pages
```bash
npx wrangler pages deploy dist --project-name kotobatuah
```
Setelah selesai, Anda langsung mendapatkan URL pratinjau `https://kotobatuah.pages.dev` untuk diuji dan dioptimalkan.

## Langkah 5: Hubungkan Domain Utama & Redirect Ekosistem di Cloudflare
1. Di **Cloudflare Dashboard → Workers & Pages → `kotobatuah` → Custom domains**:
   - Tambahkan `kotobatuah.com` dan `www.kotobatuah.com`.
2. Di **Firebase Console → Authentication → Settings → Authorized domains**:
   - Tambahkan `kotobatuah.com` dan `kotobatuah.pages.dev` agar login Google CMS berfungsi.
3. Di **Cloudflare Dashboard → Rules → Redirect Rules**:
   - Zona `kotobatuah.web.id` & `koto.biz.id`: redirect **301** `All incoming requests` → `concat("https://kotobatuah.com", http.request.uri.path)` (status DNS `@` harus **Proxied / Awan Oranye**).
   - Zona `kotobatuah.com`: redirect **301** `www.kotobatuah.com` → `https://kotobatuah.com`.
4. Setelah stabil, silakan `git init && git push` ke GitHub dan hubungkan repositori tersebut bila ingin *auto-deploy* di masa depan.
