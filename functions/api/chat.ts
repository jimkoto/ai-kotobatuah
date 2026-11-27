interface Env {
  GEMINI_API_KEY?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

interface ChatMessageInput {
  role: 'user' | 'assistant';
  content: string;
}

function buildSystemInstruction(lang: 'id' | 'en', activeService?: string): string {
  const baseId = `Anda adalah KotoAI, konsultan layanan klien real-time resmi dari agensi periklanan kotobatuah.com (Koto Batuah Media) yang berbasis operasional utama di Tangerang Raya (BSD City, Gading Serpong, Alam Sutera) dan melayani Jabodetabek serta nasional.
Layanan inti kotobatuah.com:
1. Periklanan OOH & Billboard Strategis: Jaringan videotron LED dan billboard premium di koridor utama Tangerang Raya (BSD, Alam Sutera, Karawaci, Bandara Soekarno-Hatta), Jakarta, Bandung, Padang, Surabaya, dan Medan. Estimasi paket mulai Rp 25 Juta/bulan tergantung titik dan durasi.
2. Kampanye Digital & Performance Leads: Meta Ads, Google Search & Maps Ads, TikTok Ads, serta landing page berkonversi tinggi yang terintegrasi pelacakan leads real-time.
3. Branding, Identitas Visual & Produksi Video Komersial: Identitas merek, kemasan, TVC, dan video kampanye 4K.
4. Partner Hosting & Sistem Manajemen Konten (CMS) Responsif: Server edge berlatensi rendah (Jakarta & Singapura), SLA Uptime 99.99%, serta CMS terkelola (< 1.2 detik waktu muat).
5. Optimisasi SEO + GEO Lokal: Riset kata kunci lokal, Schema.org LocalBusiness, dan halaman target kota.

Aturan komunikasi:
- Jawab selalu dalam Bahasa Indonesia yang profesional, ringkas (maksimal 3-4 kalimat), dan solutif.
- Arahkan calon klien untuk mengisi Formulir Konsultasi di halaman ini atau menekan tombol "Lanjut ke Form Konsultasi".`;

  const baseEn = `You are KotoAI, the official real-time client consultant for kotobatuah.com (Koto Batuah Media), an integrated advertising agency primarily headquartered in Greater Tangerang (Tangerang Raya: BSD City, Gading Serpong, Alam Sutera) serving Greater Jakarta and nationwide Indonesia.
Core services:
1. Strategic OOH & LED Billboards: High-traffic digital LED and billboard networks across Tangerang Raya, Jakarta, Bandung, Padang, Surabaya, and Medan (campaigns starting from IDR 25M/month depending on placement and duration).
2. Digital Campaigns & Lead Generation: Google Search & Maps Ads, Meta Ads, TikTok Ads, and high-converting landing pages with real-time lead tracking.
3. Branding, Visual Identity & Commercial Video Production: Brand systems, tactile packaging, and 4K commercial films.
4. Partner Hosting & Responsive CMS: Low-latency Indonesia/Singapore edge hosting (99.99% uptime SLA, < 1.2s load time) paired with a self-managed CMS.
5. Local SEO + GEO Optimization: Local keyword clusters, Schema.org LocalBusiness markup, and city-targeted landing architecture.

Guidelines:
- Always reply in crisp, professional English (max 3-4 concise sentences).
- Guide interested prospects to complete the Consultation Form or click "Continue to Consultation Form".`;

  const selected = lang === 'en' ? baseEn : baseId;
  return activeService
    ? `${selected}\nContext: visitor is reviewing "${activeService}".`
    : selected;
}

export const onRequestPost = async (context: PagesContext): Promise<Response> => {
  try {
    const body = (await context.request.json()) as {
      messages?: ChatMessageInput[];
      lang?: 'id' | 'en';
      activeService?: string;
    };

    const lang: 'id' | 'en' = body.lang === 'en' ? 'en' : 'id';
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const contents = messages
      .slice(-10)
      .filter((m) => m && typeof m.content === 'string' && m.content.trim().length > 0)
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content.trim().slice(0, 1000) }],
      }));

    if (contents.length === 0) {
      return new Response(
        JSON.stringify({
          error: lang === 'en' ? 'Message cannot be empty.' : 'Pesan tidak boleh kosong.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = context.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error:
            lang === 'en'
              ? 'AI service is not configured yet. Please use the consultation form below.'
              : 'Layanan AI belum dikonfigurasi. Silakan gunakan formulir konsultasi di bawah.',
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-4-hydrogen:generateContent?key=${encodeURIComponent(
      apiKey
    )}`;

    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: buildSystemInstruction(lang, body.activeService) }],
        },
        contents,
        generationConfig: {
          thinkingConfig: { thinkingLevel: 'LOW' },
        },
      }),
    });

    const data = (await upstream.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      error?: { message?: string };
    };

    if (!upstream.ok) {
      return new Response(
        JSON.stringify({
          error:
            data.error?.message ||
            (lang === 'en'
              ? 'Unable to reach AI assistant right now.'
              : 'Gagal menghubungi asisten AI saat ini.'),
        }),
        { status: upstream.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!reply) {
      return new Response(
        JSON.stringify({
          error:
            lang === 'en'
              ? 'Empty AI response. Please try again.'
              : 'Asisten AI tidak mengembalikan respons.',
        }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return new Response(
      JSON.stringify({
        error: 'Terjadi kesalahan pada edge function /api/chat.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
