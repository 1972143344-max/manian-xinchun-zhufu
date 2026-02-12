import { createServer } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { GoogleGenAI, Type } from '@google/genai';

const loadEnvFile = (relativePath) => {
  const fullPath = path.resolve(process.cwd(), relativePath);
  if (!existsSync(fullPath)) return;

  const content = readFileSync(fullPath, 'utf8');
  const lines = content.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const equalIndex = line.indexOf('=');
    if (equalIndex <= 0) continue;

    const key = line.slice(0, equalIndex).trim();
    if (!key || key in process.env) continue;

    let value = line.slice(equalIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
};

loadEnvFile('.env.local');
loadEnvFile('.env');

const HOST = process.env.API_HOST || '0.0.0.0';
const PORT = Number(process.env.PORT || process.env.API_PORT || 8787);
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ALLOWED_ORIGINS = new Set(
  (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
);

const MAX_BODY_BYTES = 4 * 1024;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 30;
const CORS_ALLOWED_METHODS = 'GET,POST,OPTIONS';
const CORS_ALLOWED_HEADERS = 'Content-Type';
const CORS_MAX_AGE_SECONDS = 600;

const prompt = `
Generate a festive, creative, and surprising Chinese New Year blessing for the Year of the Horse (2026).

Requirements:
1. Title: A 4-character energetic Chinese idiom related to Horses (e.g., leading first, success, rapid progress).
2. Content: A warm, energetic, and auspicious message (40-60 words) in Chinese.
3. Lucky Prediction: A fun, specific fortune for 2026.
4. Visual Theme: Choose one of the following that best matches the text feeling:
   - 'golden_horse': Focus on speed, success, career, moving forward.
   - 'wealth_shower': Focus on money, fortune, wealth.
   - 'spring_blossom': Focus on beauty, renewal, health, happiness.
   - 'lantern_festival': Focus on family, reunion, warmth.
   - 'fireworks_grand': Focus on celebration, excitement, grand future.

Output JSON format only.
`;

const fallbackBlessing = {
  title: '一马当先',
  content: '新春快乐，愿你在 2026 年策马扬鞭、步步高升，事业与生活都喜气洋洋，好运一路相随。',
  luckyPrediction: '今年你的行动力会带来一波非常实在的好机会。',
  visualTheme: 'golden_horse',
};

const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;
const buckets = new Map();

const setSecurityHeaders = (res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cache-Control', 'no-store');
};

const sendJson = (res, statusCode, payload) => {
  setSecurityHeaders(res);
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
};

const isOriginAllowed = (origin) => {
  if (!origin) return true;
  if (ALLOWED_ORIGINS.size === 0) return true;
  return ALLOWED_ORIGINS.has(origin);
};

const applyCorsHeaders = (req, res) => {
  const origin = req.headers.origin;
  if (!isOriginAllowed(origin)) {
    return false;
  }

  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  } else if (ALLOWED_ORIGINS.size === 0) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Methods', CORS_ALLOWED_METHODS);
  res.setHeader('Access-Control-Allow-Headers', CORS_ALLOWED_HEADERS);
  res.setHeader('Access-Control-Max-Age', String(CORS_MAX_AGE_SECONDS));
  return true;
};

const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
};

const isRateLimited = (req) => {
  const ip = getClientIp(req);
  const now = Date.now();
  const existing = buckets.get(ip);

  if (!existing || now - existing.windowStart > RATE_LIMIT_WINDOW_MS) {
    buckets.set(ip, { windowStart: now, count: 1 });
    return false;
  }

  existing.count += 1;
  if (existing.count > RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  buckets.set(ip, existing);
  return false;
};

const parseJsonBody = async (req, maxBytes) => {
  const chunks = [];
  let total = 0;

  for await (const chunk of req) {
    total += chunk.length;
    if (total > maxBytes) {
      throw new Error('PayloadTooLarge');
    }
    chunks.push(chunk);
  }

  if (chunks.length === 0) return {};

  const body = Buffer.concat(chunks).toString('utf-8');
  if (!body.trim()) return {};
  return JSON.parse(body);
};

const isBlessingPayload = (value) => {
  if (!value || typeof value !== 'object') return false;
  const data = value;
  const validThemes = new Set([
    'golden_horse',
    'wealth_shower',
    'fireworks_grand',
    'lantern_festival',
    'spring_blossom',
  ]);

  return (
    typeof data.title === 'string' &&
    typeof data.content === 'string' &&
    typeof data.luckyPrediction === 'string' &&
    typeof data.visualTheme === 'string' &&
    validThemes.has(data.visualTheme)
  );
};

const generateBlessing = async () => {
  if (!ai) {
    throw new Error('Missing GEMINI_API_KEY on server');
  }

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          luckyPrediction: { type: Type.STRING },
          visualTheme: {
            type: Type.STRING,
            enum: ['golden_horse', 'wealth_shower', 'fireworks_grand', 'lantern_festival', 'spring_blossom'],
          },
        },
        required: ['title', 'content', 'luckyPrediction', 'visualTheme'],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('No response text from Gemini');
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Gemini returned non-JSON content');
  }

  if (!isBlessingPayload(parsed)) {
    throw new Error('Gemini returned unexpected schema');
  }

  return parsed;
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const isApiPath = url.pathname === '/api/health' || url.pathname === '/api/blessing';

  if (isApiPath && req.method === 'OPTIONS') {
    if (!applyCorsHeaders(req, res)) {
      sendJson(res, 403, { message: 'Origin not allowed.' });
      return;
    }
    setSecurityHeaders(res);
    res.statusCode = 204;
    res.end();
    return;
  }

  if (url.pathname === '/api/health' && req.method === 'GET') {
    if (!applyCorsHeaders(req, res)) {
      sendJson(res, 403, { message: 'Origin not allowed.' });
      return;
    }
    sendJson(res, 200, { ok: true });
    return;
  }

  if (url.pathname === '/api/blessing' && req.method === 'POST') {
    if (!applyCorsHeaders(req, res)) {
      sendJson(res, 403, { message: 'Origin not allowed.' });
      return;
    }

    if (isRateLimited(req)) {
      sendJson(res, 429, { message: 'Too many requests, please retry later.' });
      return;
    }

    const contentType = req.headers['content-type'] || '';
    if (!String(contentType).toLowerCase().includes('application/json')) {
      sendJson(res, 415, { message: 'Content-Type must be application/json.' });
      return;
    }

    const contentLengthHeader = req.headers['content-length'];
    if (contentLengthHeader && Number(contentLengthHeader) > MAX_BODY_BYTES) {
      sendJson(res, 413, { message: 'Payload too large.' });
      return;
    }

    try {
      await parseJsonBody(req, MAX_BODY_BYTES);
      const blessing = await generateBlessing();
      sendJson(res, 200, blessing);
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message === 'PayloadTooLarge') {
        sendJson(res, 413, { message: 'Payload too large.' });
        return;
      }

      if (message.includes('JSON')) {
        sendJson(res, 400, { message: 'Invalid JSON body.' });
        return;
      }

      console.error(`[api-server] /api/blessing failed: ${message}`);
      sendJson(res, 200, fallbackBlessing);
      return;
    }
  }

  sendJson(res, 404, { message: 'Not Found' });
});

server.listen(PORT, HOST, () => {
  console.log(`[api-server] listening on http://${HOST}:${PORT}`);
  if (!GEMINI_API_KEY) {
    console.warn('[api-server] GEMINI_API_KEY is not set. Fallback blessing will be used.');
  }
});
