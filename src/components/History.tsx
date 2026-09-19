import { Clock, Trash2, Search } from 'lucide-react';
import type { HistoryEntry } from '@/types';

interface Props {
  history: HistoryEntry[];
  onWordClick: (word: string) => void;
  onRemove: (word: string) => void;
  onClear: () => void;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}d ago`;
  const hours = Math.floor(diff / 3600000);
  if (hours > 0) return `${hours}h ago`;
  const mins = Math.floor(diff / 600000);
  if (mins > 0) return `${mins}m ago`;
  return 'just now';
}

export function History({ history, onWordClick, onRemove, onClear }: Props) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="h-16 w-16 rounded-2xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center mb-6">
          <Clock className="h-8 w-8 text-ink-400 dark:text-ink-500" />
        </div>
        <h2 className="text-xl font-bold text-ink-900 dark:text-white mb-2">No search history</h2>
        <p className="text-ink-400 dark:text-ink-500 text-center max-w-sm">
          Words you search for will appear here so you can quickly find them again.
        </p>
      </div>
    );
  }

  return (
    <div className="py-4 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-ink-900 dark:text-white">
          Recent Searches
          <span className="ml-2 text-sm font-normal text-ink-400 dark:text-ink-500">
            {history.length}
          </span>
        </h2>
        <button
          onClick={onClear}
          className="text-sm text-ink-400 dark:text-ink-500 hover:text-rose-500 transition-colors font-medium"
        >
          Clear all
        </button>
      </div>
      <div className="space-y-1">
        {history.map((entry, idx) => (
          <div
            key={`${entry.word}-${entry.searchedAt}`}
            className="group flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-ink-100 dark:hover:bg-ink-900 transition-colors cursor-pointer animate-fade-in"
            style={{ animationDelay: `${idx * 30}ms` }}
            onClick={() => onWordClick(entry.word)}
          >
            <Search className="h-4 w-4 text-ink-300 dark:text-ink-600 shrink-0" />
            <span className="flex-1 text-base font-medium text-ink-800 dark:text-ink-200 capitalize truncate">
              {entry.word}
            </span>
            <span className="text-xs text-ink-400 dark:text-ink-600 shrink-0">{timeAgo(entry.searchedAt)}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(entry.word);
              }}
              aria-label={`Remove ${entry.word} from history`}
              className="h-7 w-7 rounded-lg flex items-center justify-center text-ink-300 dark:text-ink-600 hover:text-rose-500 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
