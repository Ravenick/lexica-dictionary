export function LoadingSkeleton() {
  return (
    <div className="animate-fade-in py-4">
      {/* Word header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="space-y-3">
          <div className="h-10 w-48 rounded-lg shimmer-bg animate-shimmer bg-ink-100 dark:bg-ink-800" />
          <div className="h-6 w-32 rounded-lg shimmer-bg animate-shimmer bg-ink-100 dark:bg-ink-800" />
        </div>
        <div className="flex gap-2">
          <div className="h-12 w-12 rounded-full shimmer-bg animate-shimmer bg-ink-100 dark:bg-ink-800" />
          <div className="h-12 w-12 rounded-full shimmer-bg animate-shimmer bg-ink-100 dark:bg-ink-800" />
        </div>
      </div>

      {/* Meanings */}
      {[0, 1].map((i) => (
        <div key={i} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-5 w-24 rounded-lg shimmer-bg animate-shimmer bg-ink-100 dark:bg-ink-800" />
            <div className="flex-1 h-px bg-ink-200 dark:bg-ink-800" />
          </div>
          <div className="space-y-4 ml-1">
            {[0, 1].map((j) => (
              <div key={j} className="flex gap-3">
                <div className="h-4 w-4 mt-1 rounded shimmer-bg animate-shimmer bg-ink-100 dark:bg-ink-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-full rounded shimmer-bg animate-shimmer bg-ink-100 dark:bg-ink-800" />
                  <div className="h-4 w-3/4 rounded shimmer-bg animate-shimmer bg-ink-100 dark:bg-ink-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
