import type { Definition, Meaning, Phonetic, WordEntry } from '@/types';

const API_BASE = 'https://freedictionaryapi.com/api/v1/entries/en';

interface FreeDictionaryApiResponse {
  word?: string;
  entries?: FreeDictionaryApiEntry[];
  source?: {
    url?: string;
    license?: {
      name?: string;
      url?: string;
    };
  };
}

interface FreeDictionaryApiEntry {
  partOfSpeech?: string;
  pronunciations?: FreeDictionaryPronunciation[];
  senses?: FreeDictionarySense[];
  synonyms?: string[];
  antonyms?: string[];
}

interface FreeDictionaryPronunciation {
  text?: string;
  audio?: string;
  sourceUrl?: string;
}

interface FreeDictionarySense {
  definition?: string;
  examples?: string[];
  synonyms?: string[];
  antonyms?: string[];
  subsenses?: FreeDictionarySense[];
}

export class DictionaryError extends Error {
  title: string;
  resolution?: string;

  constructor(title: string, message: string, resolution?: string) {
    super(message);
    this.title = title;
    this.resolution = resolution;
  }
}

function unique(values: Array<string | undefined>): string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value?.trim())))]
    .map((value) => value.trim());
}

function normalizePhonetics(entries: FreeDictionaryApiEntry[]): Phonetic[] {
  return entries.flatMap((entry) =>
    (entry.pronunciations ?? [])
      .filter((pronunciation) => pronunciation.text || pronunciation.audio)
      .map((pronunciation) => ({
        text: pronunciation.text,
        audio: pronunciation.audio,
        sourceUrl: pronunciation.sourceUrl,
      }))
  );
}

function normalizeSense(sense: FreeDictionarySense): Definition[] {
  const current = sense.definition
    ? [
        {
          definition: sense.definition,
          example: sense.examples?.[0],
          synonyms: unique(sense.synonyms ?? []),
          antonyms: unique(sense.antonyms ?? []),
        },
      ]
    : [];

  const subsenses = (sense.subsenses ?? []).flatMap(normalizeSense);
  return [...current, ...subsenses];
}

function normalizeMeanings(entries: FreeDictionaryApiEntry[]): Meaning[] {
  return entries
    .map((entry) => ({
      partOfSpeech: entry.partOfSpeech || 'definition',
      definitions: (entry.senses ?? []).flatMap(normalizeSense),
      synonyms: unique(entry.synonyms ?? []),
      antonyms: unique(entry.antonyms ?? []),
    }))
    .filter((meaning) => meaning.definitions.length > 0);
}

function normalizeResponse(data: FreeDictionaryApiResponse, fallbackWord: string): WordEntry[] {
  const entries = data.entries ?? [];
  const phonetics = normalizePhonetics(entries);
  const meanings = normalizeMeanings(entries);
  const sourceUrls = unique([data.source?.url, data.source?.license?.url]);

  if (!data.word || meanings.length === 0) {
    throw new DictionaryError(
      'No results found',
      `We couldn't find any definitions for "${fallbackWord}".`,
      'Double-check the spelling or try searching for a different word.'
    );
  }

  return [
    {
      word: data.word,
      phonetic: phonetics.find((phonetic) => phonetic.text)?.text,
      phonetics,
      meanings,
      sourceUrls,
    },
  ];
}

export async function fetchWord(word: string): Promise<WordEntry[]> {
  const trimmed = word.trim().toLowerCase();
  if (!trimmed) return [];

  try {
    const response = await fetch(`${API_BASE}/${encodeURIComponent(trimmed)}`);

    if (response.status === 404) {
      throw new DictionaryError(
        'No results found',
        `We couldn't find any definitions for "${word}".`,
        'Double-check the spelling or try searching for a different word.'
      );
    }

    if (!response.ok) {
      throw new DictionaryError(
        'Something went wrong',
        'The dictionary service is temporarily unavailable.',
        'Please try again in a moment.'
      );
    }

    const data = (await response.json()) as FreeDictionaryApiResponse;
    return normalizeResponse(data, word);
  } catch (error) {
    if (error instanceof DictionaryError) throw error;
    throw new DictionaryError(
      'Connection error',
      "We couldn't reach the dictionary service.",
      'Check your internet connection and try again.'
    );
  }
}
