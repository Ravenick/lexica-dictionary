import type { SavedWord, HistoryEntry, UserProfile } from '@/types';

const SAVED_KEY = 'lexica:saved-words';
const HISTORY_KEY = 'lexica:history';
const PROFILE_KEY = 'lexica:profile';
const MAX_HISTORY = 50;

export const DEFAULT_PROFILE: UserProfile = {
  name: '',
  bio: '',
  avatar: '',
};

export function getSavedWords(): SavedWord[] {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    return raw ? (JSON.parse(raw) as SavedWord[]) : [];
  } catch {
    return [];
  }
}

export function saveWord(word: SavedWord): SavedWord[] {
  const existing = getSavedWords();
  if (existing.some((w) => w.word === word.word)) return existing;
  const updated = [word, ...existing];
  localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
  return updated;
}

export function unsaveWord(word: string): SavedWord[] {
  const updated = getSavedWords().filter((w) => w.word !== word);
  localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
  return updated;
}

export function isWordSaved(word: string): boolean {
  return getSavedWords().some((w) => w.word === word);
}

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function addToHistory(word: string): HistoryEntry[] {
  const lower = word.trim().toLowerCase();
  if (!lower) return getHistory();
  const filtered = getHistory().filter((w) => w.word !== lower);
  const updated = [{ word: lower, searchedAt: Date.now() }, ...filtered].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

export function removeFromHistory(word: string): HistoryEntry[] {
  const updated = getHistory().filter((w) => w.word !== word);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

// --- Profile ---

export function getProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    return {
      name: parsed.name ?? '',
      bio: parsed.bio ?? '',
      avatar: parsed.avatar ?? '',
    };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
