export type VisualTheme = 'golden_horse' | 'wealth_shower' | 'fireworks_grand' | 'lantern_festival' | 'spring_blossom';

export interface BlessingResult {
  title: string;
  content: string;
  luckyPrediction: string;
  visualTheme: VisualTheme;
}
