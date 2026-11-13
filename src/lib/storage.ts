import AsyncStorage from '@react-native-async-storage/async-storage';

export interface QuizResult {
  beltId: string;
  beltName: string;
  correct: number;
  total: number;
  percent: number;
  date: string;
}

const KEY = 'tkd.quizResults.v1';

export async function loadResults(): Promise<QuizResult[]> {
  try {
    const s = await AsyncStorage.getItem(KEY);
    return s ? (JSON.parse(s) as QuizResult[]) : [];
  } catch {
    return [];
  }
}

export async function saveResult(r: QuizResult) {
  try {
    const all = await loadResults();
    await AsyncStorage.setItem(KEY, JSON.stringify([r, ...all].slice(0, 50)));
  } catch {
    // Non-critical: ignore storage failures.
  }
}
