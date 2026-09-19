import { Bookmark, BookmarkCheck, Volume2, ExternalLink } from 'lucide-react';
import type { WordEntry } from '@/types';

interface Props {
  entry: WordEntry;
  saved: boolean;
  onToggleSave: (entry: WordEntry) => void;
  onWordClick: (word: string) => void;
}

function getAudioUrl(entry: WordEntry): string | undefined {
  const withAudio = entry.phonetics.find((p) => p.audio && p.audio.length > 0);
  return withAudio?.audio;
}

export function WordCard({ entry, saved, onToggleSave, onWordClick }: Props) {
  const audioUrl = getAudioUrl(entry);

  const playAudio = () => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.play().catch(() => {
      // autoplay restrictions — silently ignore
    });
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header: word + phonetics */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="min-w-0">
          <h2 className="text-4xl sm:text-5xl font-bold text-ink-900 dark:text-white tracking-tight">
            {entry.word}
          </h2>
          {entry.phonetic && (
            <p className="text-lg sm:text-xl text-accent-500 dark:text-accent-400 font-medium mt-2">
              {entry.phonetic}
            </p>
          )}
          {!entry.phonetic && entry.phonetics.some((p) => p.text) && (
            <p className="text-lg sm:text-xl text-accent-500 dark:text-accent-400 font-medium mt-2">
              {entry.phonetics.find((p) => p.text)?.text}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {audioUrl && (
            <button
              onClick={playAudio}
              aria-label="Play pronunciation"
              className="h-12 w-12 rounded-full bg-accent-500 hover:bg-accent-600 active:scale-90 transition-all flex items-center justify-center shadow-lg shadow-accent-500/30"
            >
              <Volume2 className="h-5 w-5 text-white" />
            </button>
          )}
          <button
            onClick={() => onToggleSave(entry)}
            aria-label={saved ? 'Remove from saved' : 'Save word'}
            className={`h-12 w-12 rounded-full transition-all active:scale-90 flex items-center justify-center border ${
              saved
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-transparent border-ink-300 dark:border-ink-600 text-ink-400 dark:text-ink-500 hover:border-emerald-400 hover:text-emerald-500'
            }`}
          >
            {saved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Meanings */}
      <div className="space-y-8">
        {entry.meanings.map((meaning, idx) => (
          <div key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 80}ms` }}>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-semibold italic text-ink-500 dark:text-ink-400 font-serif">
                {meaning.partOfSpeech}
              </h3>
              <div className="flex-1 h-px bg-ink-200 dark:bg-ink-800" />
            </div>

            <div className="space-y-5 ml-1">
              {meaning.definitions.map((def, dIdx) => (
                <div key={dIdx} className="group">
                  <div className="flex gap-3">
                    <span className="text-sm font-semibold text-ink-300 dark:text-ink-600 mt-1 shrink-0 tabular-nums">
                      {dIdx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-base sm:text-lg text-ink-800 dark:text-ink-200 leading-relaxed">
                        {def.definition}
                      </p>
                      {def.example && (
                        <p className="mt-2 text-base text-ink-500 dark:text-ink-400 italic font-serif">
                          "{def.example}"
                        </p>
                      )}
                      {((def.synonyms.length > 0 || def.antonyms.length > 0) && (
                        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                          {def.synonyms.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-600">
                                Synonyms
                              </span>
                              {def.synonyms.slice(0, 5).map((syn) => (
                                <button
                                  key={syn}
                                  onClick={() => onWordClick(syn)}
                                  className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                                >
                                  {syn}
                                </button>
                              ))}
                            </div>
                          )}
                          {def.antonyms.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-600">
                                Antonyms
                              </span>
                              {def.antonyms.slice(0, 5).map((ant) => (
                                <button
                                  key={ant}
                                  onClick={() => onWordClick(ant)}
                                  className="text-sm text-rose-500 dark:text-rose-400 hover:underline font-medium"
                                >
                                  {ant}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Meaning-level synonyms/antonyms */}
            {(meaning.synonyms.length > 0 || meaning.antonyms.length > 0) && (
              <div className="mt-5 ml-1 flex flex-wrap gap-x-6 gap-y-2">
                {meaning.synonyms.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-600">
                      Synonyms
                    </span>
                    {meaning.synonyms.slice(0, 8).map((syn) => (
                      <button
                        key={syn}
                        onClick={() => onWordClick(syn)}
                        className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                      >
                        {syn}
                      </button>
                    ))}
                  </div>
                )}
                {meaning.antonyms.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-600">
                      Antonyms
                    </span>
                    {meaning.antonyms.slice(0, 8).map((ant) => (
                      <button
                        key={ant}
                        onClick={() => onWordClick(ant)}
                        className="text-sm text-rose-500 dark:text-rose-400 hover:underline font-medium"
                      >
                        {ant}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Source */}
      {entry.sourceUrls.length > 0 && (
        <div className="mt-10 pt-6 border-t border-ink-200 dark:border-ink-800">
          <div className="flex flex-wrap items-center gap-2 text-sm text-ink-400 dark:text-ink-500">
            <span className="font-semibold">Source</span>
            {entry.sourceUrls.map((url) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-accent-500 dark:text-accent-400 hover:underline"
              >
                {url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
