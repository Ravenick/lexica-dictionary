import { useState, useEffect, useCallback } from 'react';
import { BookOpen, Bookmark, Clock, Sparkles } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { fetchWord, DictionaryError } from '@/lib/dictionary';
import {
  getSavedWords,
  saveWord as saveWordStorage,
  unsaveWord as unsaveWordStorage,
  getHistory,
  addToHistory,
  removeFromHistory,
  clearHistory,
  getProfile,
  saveProfile,
  DEFAULT_PROFILE,
} from '@/lib/storage';
import type { WordEntry, SavedWord, HistoryEntry, UserProfile, View } from '@/types';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchBar } from '@/components/SearchBar';
import { WordCard } from '@/components/WordCard';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { SavedWords } from '@/components/SavedWords';
import { History } from '@/components/History';
import { ProfileModal } from '@/components/ProfileModal';
import RavenickBadge from '@/components/RavenickBadge';

interface ErrorInfo {
  title: string;
  message: string;
  resolution?: string;
}

const NAV_ITEMS: { id: View; label: string; icon: typeof BookOpen }[] = [
  { id: 'search', label: 'Search', icon: BookOpen },
  { id: 'saved', label: 'Saved', icon: Bookmark },
  { id: 'history', label: 'History', icon: Clock },
];

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [view, setView] = useState<View>('search');
  const [entries, setEntries] = useState<WordEntry[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [savedWords, setSavedWords] = useState<SavedWord[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [savedSet, setSavedSet] = useState<Set<string>>(new Set());
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [showProfile, setShowProfile] = useState(false);

  // Load saved words, history, and profile on mount
  useEffect(() => {
    const saved = getSavedWords();
    const hist = getHistory();
    const prof = getProfile();
    setSavedWords(saved);
    setHistory(hist);
    setSavedSet(new Set(saved.map((w) => w.word)));
    setProfile(prof);
  }, []);

  const handleSaveProfile = useCallback((p: UserProfile) => {
    setProfile(p);
    saveProfile(p);
  }, []);

  const profileInitial = profile.name.trim().charAt(0).toUpperCase() || '?';

  const search = useCallback(async (word: string) => {
    const trimmed = word.trim();
    if (!trimmed) return;

    setView('search');
    setSearchTerm(trimmed);
    setLoading(true);
    setError(null);
    setEntries(null);

    // Add to history immediately
    const newHistory = addToHistory(trimmed);
    setHistory(newHistory);

    try {
      const results = await fetchWord(trimmed);
      setEntries(results);
    } catch (err) {
      if (err instanceof DictionaryError) {
        setError({ title: err.title, message: err.message, resolution: err.resolution });
      } else {
        setError({
          title: 'Unexpected error',
          message: 'Something went wrong while fetching the definition.',
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleSave = useCallback(
    (entry: WordEntry) => {
      const word = entry.word;
      if (savedSet.has(word)) {
        const updated = unsaveWordStorage(word);
        setSavedWords(updated);
        setSavedSet(new Set(updated.map((w) => w.word)));
      } else {
        const firstMeaning = entry.meanings[0];
        const firstDef = firstMeaning?.definitions[0];
        const saved: SavedWord = {
          word,
          savedAt: Date.now(),
          phonetic: entry.phonetic || entry.phonetics.find((p) => p.text)?.text,
          partOfSpeech: firstMeaning?.partOfSpeech,
          definition: firstDef?.definition,
        };
        const updated = saveWordStorage(saved);
        setSavedWords(updated);
        setSavedSet(new Set(updated.map((w) => w.word)));
      }
    },
    [savedSet]
  );

  const handleRemoveSaved = useCallback((word: string) => {
    const updated = unsaveWordStorage(word);
    setSavedWords(updated);
    setSavedSet(new Set(updated.map((w) => w.word)));
  }, []);

  const handleRemoveHistory = useCallback((word: string) => {
    const updated = removeFromHistory(word);
    setHistory(updated);
  }, []);

  const handleClearHistory = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  const isSaved = entries?.some((e) => savedSet.has(e.word)) ?? false;
  const currentWord = entries?.[0];

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950 transition-colors duration-300">
      {/* Ambient gradient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-accent-500/5 dark:bg-accent-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-ink-200/50 dark:border-ink-800/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-500 to-emerald-500 blur-md opacity-40" />
                <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-accent-500 to-emerald-500 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-ink-900 dark:text-white leading-none">
                  Lexica
                </h1>
                <p className="text-[10px] font-medium text-ink-400 dark:text-ink-500 uppercase tracking-widest mt-0.5">
                  Dictionary
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
              <button
                onClick={() => setShowProfile(true)}
                aria-label="Open profile"
                className="h-10 w-10 rounded-xl overflow-hidden bg-ink-100 dark:bg-ink-800 hover:ring-2 hover:ring-accent-400 transition-all active:scale-90 flex items-center justify-center"
              >
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm font-bold bg-gradient-to-br from-accent-500 to-emerald-500 bg-clip-text text-transparent">
                    {profileInitial}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Navigation tabs */}
          <nav className="flex items-center gap-1 pb-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = view === item.id;
              const count = item.id === 'saved' ? savedWords.length : item.id === 'history' ? history.length : 0;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'text-ink-900 dark:text-white'
                      : 'text-ink-400 dark:text-ink-500 hover:text-ink-600 dark:hover:text-ink-300'
                  }`}
                >
                  {active && (
                    <div className="absolute inset-0 bg-ink-100 dark:bg-ink-800 rounded-xl" />
                  )}
                  <Icon className="relative h-4 w-4" />
                  <span className="relative">{item.label}</span>
                  {count > 0 && (
                    <span className="relative text-xs font-semibold bg-ink-200 dark:bg-ink-700 text-ink-600 dark:text-ink-300 px-1.5 rounded-full min-w-[20px] text-center">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-24">
        {/* Search bar â€” always visible */}
        {view === 'search' && (
          <div className="mb-8">
            <SearchBar onSearch={search} initialValue={searchTerm} loading={loading} autoFocus />
          </div>
        )}

        {/* Search view */}
        {view === 'search' && (
          <>
            {loading && <LoadingSkeleton />}
            {!loading && error && (
              <ErrorState title={error.title} message={error.message} resolution={error.resolution} />
            )}
            {!loading && !error && entries && currentWord && (
              <div className="space-y-8">
                <WordCard
                  entry={currentWord}
                  saved={isSaved}
                  onToggleSave={toggleSave}
                  onWordClick={search}
                />
                {entries.length > 1 && (
                  <div className="space-y-8 pt-4 border-t border-ink-200 dark:border-ink-800">
                    <p className="text-sm font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wider">
                      More definitions
                    </p>
                    {entries.slice(1).map((entry, idx) => (
                      <WordCard
                        key={`${entry.word}-${idx}`}
                        entry={entry}
                        saved={savedSet.has(entry.word)}
                        onToggleSave={toggleSave}
                        onWordClick={search}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            {!loading && !error && !entries && (
              <EmptyState onWordClick={search} />
            )}
          </>
        )}

        {/* Saved view */}
        {view === 'saved' && (
          <>
            {savedWords.length > 0 && (
              <div className="mb-6">
                <SearchBar onSearch={search} placeholder="Search for a new wordâ€¦" autoFocus />
              </div>
            )}
            <SavedWords words={savedWords} onWordClick={search} onRemove={handleRemoveSaved} />
          </>
        )}

        {/* History view */}
        {view === 'history' && (
          <>
            {history.length > 0 && (
              <div className="mb-6">
                <SearchBar onSearch={search} placeholder="Search for a new wordâ€¦" autoFocus />
              </div>
            )}
            <History
              history={history}
              onWordClick={search}
              onRemove={handleRemoveHistory}
              onClear={handleClearHistory}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="relative max-w-3xl mx-auto px-4 sm:px-6 pb-10">
        <div className="flex items-center justify-center gap-2 text-xs text-ink-400 dark:text-ink-600">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Powered by Free Dictionary API</span>
        </div>
      </footer>
      <RavenickBadge />

      {/* Profile modal */}
      {showProfile && (
        <ProfileModal
          profile={profile}
          onSave={handleSaveProfile}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
}


