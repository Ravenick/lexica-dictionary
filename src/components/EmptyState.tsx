import { Search } from 'lucide-react';

interface Props {
  onWordClick: (word: string) => void;
}

const SUGGESTIONS = [
  'serendipity',
  'ephemeral',
  'eloquent',
  'nostalgia',
  'luminous',
  'resilience',
  'wanderlust',
  'solitude',
  'petrichor',
  'ethereal',
];

export function EmptyState({ onWordClick }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 animate-fade-in">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-500/30 to-emerald-500/30 blur-3xl" />
        <div className="relative h-20 w-20 rounded-3xl bg-gradient-to-br from-accent-500 to-emerald-500 flex items-center justify-center shadow-2xl shadow-accent-500/20">
          <Search className="h-9 w-9 text-white" />
        </div>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white text-center mb-3">
        Search for any word
      </h2>
      <p className="text-ink-400 dark:text-ink-500 text-center max-w-md mb-10 text-balance">
        Explore definitions, pronunciations, synonyms, and examples. Save your favorite words for later.
      </p>
      <div className="flex flex-wrap justify-center gap-2 max-w-lg">
        {SUGGESTIONS.map((word) => (
          <button
            key={word}
            onClick={() => onWordClick(word)}
            className="px-4 py-2 rounded-full bg-ink-100 dark:bg-ink-800 hover:bg-ink-200 dark:hover:bg-ink-700 text-sm font-medium text-ink-600 dark:text-ink-300 transition-all active:scale-95 hover:shadow-md"
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
}
