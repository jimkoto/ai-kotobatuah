import http from 'node:http';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx !== -1 && idx + 1 < process.argv.length) {
    return process.argv[idx + 1];
  }
  const eqPrefix = `${flag}=`;
  const match = process.argv.find((arg) => arg.startsWith(eqPrefix));
  return match ? match.slice(eqPrefix.length) : undefined;
}

const PORT = Number(getArgValue('--port') || process.env.PORT || 3000);
const HOST = getArgValue('--host') || process.env.HOST || '0.0.0.0';

function buildSystemInstruction(lang: 'id' | 'en', activeService?: string): string {
  const baseId = `Anda adalah KotoAI, konsultan layanan klien real-time resmi dari agensi periklanan kotobatuah.com (Koto Batuah Media) yang berbasis operasional utama di Tangerang Raya (BSD City, Gading Serpong, Alam Sutera) dan melayani Jabodetabek serta nasional.
Identitas & Layanan kotobatuah.com:
1. Periklanan OOH & Billboard Strategis: Jaringan videotron LED dan billboard premium di koridor utama Tangerang Raya (BSD, Alam Sutera, Karawaci, Bandara Soekarno-Hatta), Jabodetabek, Bandung, Padang, Surabaya, dan Medan. Estimasi paket kampanye mulai Rp 25 Juta/bulan tergantung titik dan durasi.
2. Kampanye Digital & Performance Leads: Meta Ads, Google Search & Maps Ads, TikTok Ads, serta landing page berkonversi tinggi yang terintegrasi pelacakan leads real-time.
3. Branding, Identitas Visual & Produksi Video Komersial: Pembuatan identitas merek, desain kemasan, TVC, dan video kampanye vertikal/landscape berkualitas sinema.
4. Partner Hosting & Sistem Manajemen Konten (CMS) Responsif: Infrastruktur hosting berkecepatan tinggi dengan server edge Jakarta & Singapura, SLA Uptime 99.99%, proteksi DDoS, serta CMS terkelola untuk publikasi portofolio dan landing page kampanye (< 1.2 detik waktu muat).
5. Optimisasi SEO + GEO Lokal: Riset kata kunci lokal per kota, Schema.org LocalBusiness, optimisasi Google Business Profile, dan halaman target wilayah agar bisnis klien muncul di peringkat teratas pencarian lokal.

Aturan komunikasi:
- Jawab selalu dalam Bahasa Indonesia yang profesional, hangat, ringkas (maksimal 3-4 kalimat atau poin singkat yang jelas), dan berorientasi solusi bisnis.
- Selalu arahkan calon klien yang berminat pada penawaran harga, jadwal tayang, atau audit kampanye untuk mengisi Formulir Konsultasi di halaman ini atau menekan tombol "Lanjut ke Form Konsultasi" agar tim strategist kami segera menghubungi via WhatsApp/email.
- Jangan pernah mengarang metrik palsu atau menjanjikan hasil di luar cakupan layanan kotobatuah.com.`;

  const baseEn = `You are KotoAI, the official real-time client consultant for kotobatuah.com (Koto Batuah Media), an integrated advertising agency primarily headquartered in Greater Tangerang (Tangerang Raya: BSD City, Gading Serpong, Alam Sutera) serving Greater Jakarta and nationwide Indonesia.
Core services:
1. Strategic OOH & LED Billboards: High-traffic digital LED and billboard networks across Tangerang Raya, Jakarta, Bandung, Padang, Surabaya, and Medan (campaigns starting from IDR 25M/month depending on placement and duration).
2. Digital Campaigns & Lead Generation: Google Search & Maps Ads, Meta Ads, TikTok Ads, and high-converting landing pages with real-time lead tracking.
3. Branding, Visual Identity & Commercial Video Production: Brand systems, tactile packaging, and 4K commercial films.
4. Partner Hosting & Responsive CMS: Low-latency Indonesia/Singapore edge hosting (99.99% uptime SLA, < 1.2s load time) paired with a self-managed CMS.
5. Local SEO + GEO Optimization: Local keyword clusters, Schema.org LocalBusiness markup, and city-targeted landing architecture.

Communication rules:
- Always respond in crisp, professional English (max 3-4 concise sentences or clear bullet points).
- Always guide interested prospects toward the Consultation Form on this page or the "Continue to Consultation Form" button so our senior strategists can follow up via WhatsApp/email.
- Never fabricate metrics or promise outcomes outside kotobatuah.com capabilities.`;

  const base = lang === 'en' ? baseEn : baseId;
  return activeService
    ? `${base}\nContext: visitor is reviewing "${activeService}".`
    : base;
}

function createGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'kotobatuah.com' });
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, activeService, lang: rawLang } = req.body as {
        messages?: Array<{ role: 'user' | 'assistant'; content: string }>;
        activeService?: string;
        lang?: 'id' | 'en';
      };

      const lang: 'id' | 'en' = rawLang === 'en' ? 'en' : 'id';

      if (!Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({
          error: lang === 'en' ? 'Message cannot be empty.' : 'Pesan tidak boleh kosong.',
        });
        return;
      }

      const sanitizedMessages = messages
        .slice(-10)
        .filter((m) => m && typeof m.content === 'string' && m.content.trim().length > 0)
        .map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content.trim().slice(0, 1000) }],
        }));

      if (sanitizedMessages.length === 0) {
        res.status(400).json({
          error: lang === 'en' ? 'Invalid message format.' : 'Format pesan tidak valid.',
        });
        return;
      }

      const ai = createGeminiClient();
      if (!ai) {
        res.status(503).json({
          error:
            lang === 'en'
              ? 'AI service is not configured yet. Please use the consultation form below.'
              : 'Layanan asisten AI belum terkonfigurasi. Silakan gunakan formulir konsultasi langsung di bawah.',
        });
        return;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: sanitizedMessages,
        config: {
          systemInstruction: buildSystemInstruction(lang, activeService),
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const replyText = response.text?.trim();
      if (!replyText) {
        res.status(502).json({
          error:
            lang === 'en'
              ? 'AI assistant did not return a response. Please try again.'
              : 'Asisten AI tidak mengembalikan respons. Silakan coba beberapa saat lagi.',
        });
        return;
      }

      res.json({ reply: replyText });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan pada server AI.';
      console.error('Gemini chat error:', message);
      res.status(500).json({
        error: 'Gagal memproses pesan Anda saat ini. Silakan coba kembali atau kirim kebutuhan melalui formulir konsultasi.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const disableHmr = process.env.DISABLE_HMR === 'true';
    const { createServer: createViteServer } = await import('vite');
    let viteMiddleware:
      | ((req: http.IncomingMessage, res: http.ServerResponse, next: express.NextFunction) => void)
      | null = null;
    const viteReady = createViteServer({
      server: {
        middlewareMode: true,
        hmr: disableHmr ? false : { server: httpServer },
        ws: disableHmr ? false : undefined,
      },
      appType: 'spa',
    }).then((vite) => {
      viteMiddleware = vite.middlewares;
      return vite;
    });

    app.use(async (req, res, next) => {
      try {
        if (!viteMiddleware) {
          await viteReady;
        }
        viteMiddleware!(req, res, next);
      } catch (err) {
        next(err);
      }
    });

    httpServer.listen(PORT, HOST, () => {
      console.log(`kotobatuah.com dev server listening on http://${HOST}:${PORT}`);
    });
    await viteReady;
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });

    httpServer.listen(PORT, HOST, () => {
      console.log(`kotobatuah.com server listening on http://${HOST}:${PORT}`);
    });
  }
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
