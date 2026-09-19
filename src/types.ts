export interface Phonetic {
  text?: string;
  audio?: string;
  sourceUrl?: string;
}

export interface Definition {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
}

export interface WordEntry {
  word: string;
  phonetic?: string;
  phonetics: Phonetic[];
  origin?: string;
  meanings: Meaning[];
  sourceUrls: string[];
}

export interface SavedWord {
  word: string;
  savedAt: number;
  phonetic?: string;
  partOfSpeech?: string;
  definition?: string;
}

export interface HistoryEntry {
  word: string;
  searchedAt: number;
}

export interface UserProfile {
  name: string;
  bio: string;
  avatar: string; // data URL
}

export type View = 'search' | 'saved' | 'history';
export type Theme = 'dark' | 'light';
