import { Moon, Sun } from 'lucide-react';

interface Props {
  theme: 'dark' | 'light';
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative h-10 w-10 rounded-xl bg-ink-100 dark:bg-ink-800 hover:bg-ink-200 dark:hover:bg-ink-700 transition-all flex items-center justify-center group active:scale-90"
    >
      <div className="animate-scale-in">
        {theme === 'dark' ? (
          <Moon className="h-5 w-5 text-accent-400" />
        ) : (
          <Sun className="h-5 w-5 text-amber-500" />
        )}
      </div>
    </button>
  );
}
