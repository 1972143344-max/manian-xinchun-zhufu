import { BlessingResult } from '../types';

const fallbackBlessing: BlessingResult = {
  title: '一马当先',
  content: '新春快乐，愿你在 2026 年策马扬鞭、步步高升，事业与生活都喜气洋洋，好运一路相随。',
  luckyPrediction: '今年你的行动力会带来一波非常实在的好机会。',
  visualTheme: 'golden_horse',
};

const allowedThemes: BlessingResult['visualTheme'][] = [
  'golden_horse',
  'wealth_shower',
  'fireworks_grand',
  'lantern_festival',
  'spring_blossom',
];

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
const BLESSING_ENDPOINT = `${API_BASE_URL}/api/blessing`;

const isBlessingResult = (value: unknown): value is BlessingResult => {
  if (!value || typeof value !== 'object') return false;
  const data = value as Partial<BlessingResult>;
  return (
    typeof data.title === 'string' &&
    typeof data.content === 'string' &&
    typeof data.luckyPrediction === 'string' &&
    typeof data.visualTheme === 'string' &&
    allowedThemes.includes(data.visualTheme as BlessingResult['visualTheme'])
  );
};

export const generateRandomBlessing = async (): Promise<BlessingResult> => {
  try {
    const response = await fetch(BLESSING_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      const trimmedDetail = detail.slice(0, 160);
      throw new Error(
        `Blessing API request failed with status ${response.status}${trimmedDetail ? `: ${trimmedDetail}` : ''}`
      );
    }

    const data = await response.json();
    if (!isBlessingResult(data)) {
      throw new Error('Blessing API returned invalid data shape');
    }

    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (
      /ECONNREFUSED|Failed to fetch|status 500|proxy error/i.test(errorMessage)
    ) {
      console.warn(
        '[Blessing API] Backend proxy unavailable. Start it with: npm run dev:api (or npm run dev:all).'
      );
    }
    console.error('Blessing API error:', errorMessage);
    return fallbackBlessing;
  }
};
