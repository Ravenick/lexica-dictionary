import { Bookmark, Trash2 } from 'lucide-react';
import type { SavedWord } from '@/types';

interface Props {
  words: SavedWord[];
  onWordClick: (word: string) => void;
  onRemove: (word: string) => void;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86400000);
  if (days > 30) return new Date(ts).toLocaleDateString();
  if (days > 0) return `${days}d ago`;
  const hours = Math.floor(diff / 3600000);
  if (hours > 0) return `${hours}h ago`;
  const mins = Math.floor(diff / 60000);
  if (mins > 0) return `${mins}m ago`;
  return 'just now';
}

export function SavedWords({ words, onWordClick, onRemove }: Props) {
  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="h-16 w-16 rounded-2xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center mb-6">
          <Bookmark className="h-8 w-8 text-ink-400 dark:text-ink-500" />
        </div>
        <h2 className="text-xl font-bold text-ink-900 dark:text-white mb-2">No saved words yet</h2>
        <p className="text-ink-400 dark:text-ink-500 text-center max-w-sm">
          Search for a word and tap the bookmark icon to save it here.
        </p>
      </div>
    );
  }

  return (
    <div className="py-4 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-ink-900 dark:text-white">
          Saved Words
          <span className="ml-2 text-sm font-normal text-ink-400 dark:text-ink-500">
            {words.length}
          </span>
        </h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {words.map((word, idx) => (
          <div
            key={word.word}
            className="group relative bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-2xl p-4 hover:border-accent-300 dark:hover:border-accent-700 transition-all cursor-pointer animate-fade-in-up"
            style={{ animationDelay: `${idx * 50}ms` }}
            onClick={() => onWordClick(word.word)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-ink-900 dark:text-white capitalize truncate">
                  {word.word}
                </h3>
                {word.phonetic && (
                  <p className="text-sm text-accent-500 dark:text-accent-400 font-medium">
                    {word.phonetic}
                  </p>
                )}
                {word.partOfSpeech && (
                  <p className="text-xs italic text-ink-400 dark:text-ink-500 mt-1 font-serif">
                    {word.partOfSpeech}
                  </p>
                )}
                {word.definition && (
                  <p className="text-sm text-ink-500 dark:text-ink-400 mt-2 line-clamp-2">
                    {word.definition}
                  </p>
                )}
                <p className="text-xs text-ink-400 dark:text-ink-600 mt-2">{timeAgo(word.savedAt)}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(word.word);
                }}
                aria-label={`Remove ${word.word}`}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-ink-300 dark:text-ink-600 hover:text-rose-500 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

