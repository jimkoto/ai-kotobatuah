import { SEED_PROCEDURE_PAGES } from '../data/seedData';
import type {
  BlogPost,
  DriveSpreadsheetSummary,
  ProcedurePage,
  SiteSettings,
  SpreadsheetTabInfo,
} from '../types/domain';
import { blogPostToSheetRow, buildBlogTemplateSheetsPayload } from '../utils/sheetsParser';

const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets';

export class WorkspaceApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'WorkspaceApiError';
    this.status = status;
  }
}

async function parseGoogleApiResponse<T>(res: Response, fallbackMsg: string): Promise<T> {
  if (res.ok) {
    return (await res.json()) as T;
  }

  let errorDetail = fallbackMsg;
  try {
    const body = (await res.json()) as { error?: { message?: string } };
    if (body?.error?.message) {
      errorDetail = body.error.message;
    }
  } catch {
    // Keep fallback
  }

  if (res.status === 401 || res.status === 403) {
    throw new WorkspaceApiError(
      `Akses Google Workspace ditolak atau sesi token kedaluwarsa (${res.status}). Silakan klik "Sign in with Google" untuk menghubungkan ulang izin Drive & Sheets.`,
      res.status
    );
  }

  throw new WorkspaceApiError(errorDetail, res.status);
}

function escapeSheetNameForA1(tabName: string): string {
  const safe = tabName.trim().replace(/'/g, "''");
  return `'${safe}'`;
}

export async function listUserSpreadsheets(
  accessToken: string
): Promise<DriveSpreadsheetSummary[]> {
  const q = "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false";
  const params = new URLSearchParams({
    q,
    fields: 'files(id,name,modifiedTime,webViewLink)',
    orderBy: 'modifiedTime desc',
    pageSize: '25',
  });

  const res = await fetch(`${DRIVE_API}/files?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await parseGoogleApiResponse<{ files?: DriveSpreadsheetSummary[] }>(
    res,
    'Gagal mengambil daftar Google Sheets dari Google Drive.'
  );

  return Array.isArray(data.files) ? data.files : [];
}

export async function getSpreadsheetMetadata(
  accessToken: string,
  spreadsheetId: string
): Promise<{
  spreadsheetId: string;
  title: string;
  spreadsheetUrl: string;
  tabs: SpreadsheetTabInfo[];
}> {
  const params = new URLSearchParams({
    fields: 'spreadsheetId,properties(title),spreadsheetUrl,sheets(properties(sheetId,title,index))',
  });

  const res = await fetch(
    `${SHEETS_API}/${encodeURIComponent(spreadsheetId)}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await parseGoogleApiResponse<{
    spreadsheetId?: string;
    properties?: { title?: string };
    spreadsheetUrl?: string;
    sheets?: Array<{
      properties?: { sheetId?: number; title?: string; index?: number };
    }>;
  }>(res, 'Gagal membaca metadata tab Google Sheets.');

  const tabs: SpreadsheetTabInfo[] = (data.sheets ?? [])
    .map((s, idx) => ({
      sheetId: Number(s.properties?.sheetId ?? idx),
      title: String(s.properties?.title ?? `Tab_${idx + 1}`),
      index: Number(s.properties?.index ?? idx),
    }))
    .sort((a, b) => a.index - b.index);

  return {
    spreadsheetId: data.spreadsheetId ?? spreadsheetId,
    title: data.properties?.title ?? 'Google Spreadsheet',
    spreadsheetUrl:
      data.spreadsheetUrl ?? `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    tabs,
  };
}

export async function fetchSheetRange(
  accessToken: string,
  spreadsheetId: string,
  tabName: string,
  range = 'A1:Z500'
): Promise<string[][]> {
  const a1Notation = `${escapeSheetNameForA1(tabName)}!${range}`;
  const res = await fetch(
    `${SHEETS_API}/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(a1Notation)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await parseGoogleApiResponse<{ values?: string[][] }>(
    res,
    `Gagal membaca isi tab "${tabName}".`
  );

  return Array.isArray(data.values) ? data.values : [];
}

export async function createBlogCmsSpreadsheet(
  accessToken: string,
  siteSettings: SiteSettings,
  seedPosts: BlogPost[],
  seedProcedures: ProcedurePage[] = SEED_PROCEDURE_PAGES
): Promise<{
  spreadsheetId: string;
  spreadsheetTitle: string;
  spreadsheetUrl: string;
  tabs: SpreadsheetTabInfo[];
}> {
  const payload = buildBlogTemplateSheetsPayload(siteSettings, seedPosts, seedProcedures);

  const createRes = await fetch(SHEETS_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: payload.title,
        locale: 'id_ID',
        timeZone: 'Asia/Jakarta',
      },
      sheets: payload.tabs.map((tab, index) => ({
        properties: {
          title: tab.name,
          index,
          gridProperties: {
            frozenRowCount: 1,
          },
        },
      })),
    }),
  });

  const created = await parseGoogleApiResponse<{
    spreadsheetId: string;
    spreadsheetUrl?: string;
    properties?: { title?: string };
    sheets?: Array<{ properties?: { sheetId?: number; title?: string; index?: number } }>;
  }>(createRes, 'Gagal membuat template spreadsheet di Google Drive.');

  const spreadsheetId = created.spreadsheetId;
  const tabs: SpreadsheetTabInfo[] = (created.sheets ?? []).map((s, idx) => ({
    sheetId: Number(s.properties?.sheetId ?? idx),
    title: String(s.properties?.title ?? payload.tabs[idx]?.name ?? `Tab_${idx + 1}`),
    index: Number(s.properties?.index ?? idx),
  }));

  // Populate initial headers + sample data across all 4 tabs
  const valueRanges = payload.tabs.map((tab) => ({
    range: `${escapeSheetNameForA1(tab.name)}!A1`,
    majorDimension: 'ROWS',
    values: tab.rows,
  }));

  const populateRes = await fetch(
    `${SHEETS_API}/${encodeURIComponent(spreadsheetId)}/values:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        valueInputOption: 'USER_ENTERED',
        data: valueRanges,
      }),
    }
  );
  await parseGoogleApiResponse<unknown>(
    populateRes,
    'Spreadsheet berhasil dibuat tetapi gagal mengisi baris awal.'
  );

  // Format header row styling across all tabs (best-effort polish)
  const formatRequests = tabs.map((tab) => ({
    repeatCell: {
      range: {
        sheetId: tab.sheetId,
        startRowIndex: 0,
        endRowIndex: 1,
      },
      cell: {
        userEnteredFormat: {
          backgroundColor: { red: 0.05, green: 0.07, blue: 0.09 },
          textFormat: {
            foregroundColor: { red: 1, green: 1, blue: 1 },
            bold: true,
            fontSize: 10,
          },
        },
      },
      fields: 'userEnteredFormat(backgroundColor,textFormat)',
    },
  }));

  if (formatRequests.length > 0) {
    await fetch(`${SHEETS_API}/${encodeURIComponent(spreadsheetId)}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests: formatRequests }),
    }).catch(() => undefined);
  }

  return {
    spreadsheetId,
    spreadsheetTitle: created.properties?.title ?? payload.title,
    spreadsheetUrl:
      created.spreadsheetUrl ?? `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    tabs,
  };
}

export async function appendBlogPostRow(
  accessToken: string,
  spreadsheetId: string,
  tabName: string,
  post: BlogPost
): Promise<void> {
  const a1Notation = `${escapeSheetNameForA1(tabName)}!A1:S1`;
  const params = new URLSearchParams({
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
  });

  const res = await fetch(
    `${SHEETS_API}/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(a1Notation)}:append?${params.toString()}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        majorDimension: 'ROWS',
        values: [blogPostToSheetRow(post)],
      }),
    }
  );

  await parseGoogleApiResponse<unknown>(
    res,
    `Gagal menambahkan baris artikel ke tab "${tabName}".`
  );
}
