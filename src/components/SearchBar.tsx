import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface Props {
  onSearch: (word: string) => void;
  initialValue?: string;
  loading?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
}

export function SearchBar({ onSearch, initialValue = '', loading = false, autoFocus = false, placeholder = 'Search for any word…' }: Props) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = value.trim();
      if (trimmed) onSearch(trimmed);
    },
    [value, onSearch]
  );

  const handleClear = () => {
    setValue('');
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-500/20 to-emerald-500/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
        <div className="relative flex items-center gap-3 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 rounded-2xl px-4 h-14 transition-all group-focus-within:border-accent-400 dark:group-focus-within:border-accent-500 shadow-sm dark:shadow-none">
          <Search className="h-5 w-5 text-ink-400 dark:text-ink-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-lg font-medium text-ink-900 dark:text-ink-100 placeholder:text-ink-400 dark:placeholder:text-ink-600"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            enterKeyHint="search"
          />
          {loading && <Loader2 className="h-5 w-5 text-accent-500 animate-spin shrink-0" />}
          {!loading && value && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="h-6 w-6 rounded-full flex items-center justify-center hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors shrink-0"
            >
              <X className="h-4 w-4 text-ink-400 dark:text-ink-500" />
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
