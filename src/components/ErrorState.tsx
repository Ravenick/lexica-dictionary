import { SearchX } from 'lucide-react';

interface Props {
  title: string;
  message: string;
  resolution?: string;
}

export function ErrorState({ title, message, resolution }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="h-16 w-16 rounded-2xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center mb-6">
        <SearchX className="h-8 w-8 text-ink-400 dark:text-ink-500" />
      </div>
      <h2 className="text-xl font-bold text-ink-900 dark:text-white mb-2">{title}</h2>
      <p className="text-ink-400 dark:text-ink-500 text-center max-w-sm mb-2">{message}</p>
      {resolution && (
        <p className="text-sm text-ink-400 dark:text-ink-600 text-center max-w-sm">{resolution}</p>
      )}
    </div>
  );
}
