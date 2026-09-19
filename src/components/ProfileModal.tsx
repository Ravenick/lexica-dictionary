import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Camera, User, Trash2, Check } from 'lucide-react';
import type { UserProfile } from '@/types';

interface Props {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onClose: () => void;
}

const MAX_AVATAR_BYTES = 2_000_000; // 2 MB — keep localStorage reasonable

export function ProfileModal({ profile, onSave, onClose }: Props) {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setError('Image is too large — please use one under 2 MB.');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleSave = () => {
    onSave({ name: name.trim(), bio: bio.trim(), avatar });
    onClose();
  };

  const handleRemoveAvatar = () => {
    setAvatar('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const initial = name.trim().charAt(0).toUpperCase() || '?';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-white dark:bg-ink-900 rounded-3xl shadow-2xl border border-ink-200 dark:border-ink-800 animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <h2 className="text-lg font-bold text-ink-900 dark:text-white">Your Profile</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="h-8 w-8 rounded-lg flex items-center justify-center text-ink-400 dark:text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`relative h-28 w-28 rounded-full cursor-pointer group transition-all ${
                dragging
                  ? 'ring-4 ring-accent-400 scale-105'
                  : 'ring-2 ring-ink-200 dark:ring-ink-700 hover:ring-accent-400'
              }`}
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt="Profile"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="h-full w-full rounded-full bg-gradient-to-br from-accent-500 to-emerald-500 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{initial}</span>
                </div>
              )}
              {/* Camera overlay */}
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="h-7 w-7 text-white" />
              </div>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />

            <div className="flex items-center gap-3">
              <button
                onClick={() => fileRef.current?.click()}
                className="text-sm font-medium text-accent-500 dark:text-accent-400 hover:underline"
              >
                Upload photo
              </button>
              {avatar && (
                <>
                  <span className="text-ink-300 dark:text-ink-700">·</span>
                  <button
                    onClick={handleRemoveAvatar}
                    className="inline-flex items-center gap-1 text-sm font-medium text-rose-500 hover:underline"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </>
              )}
            </div>

            {error && <p className="text-sm text-rose-500 text-center">{error}</p>}
            <p className="text-xs text-ink-400 dark:text-ink-600 text-center">
              Drag & drop or click to upload. Max 2 MB.
            </p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-ink-600 dark:text-ink-300 mb-2">
              Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 dark:text-ink-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                maxLength={50}
                className="w-full bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-700 rounded-xl pl-10 pr-4 h-12 text-base text-ink-900 dark:text-ink-100 placeholder:text-ink-400 dark:placeholder:text-ink-600 outline-none focus:border-accent-400 dark:focus:border-accent-500 transition-colors"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-ink-600 dark:text-ink-300 mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A few words about yourself…"
              maxLength={160}
              rows={3}
              className="w-full bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-700 rounded-xl px-4 py-3 text-base text-ink-900 dark:text-ink-100 placeholder:text-ink-400 dark:placeholder:text-ink-600 outline-none focus:border-accent-400 dark:focus:border-accent-500 transition-colors resize-none"
            />
            <p className="text-xs text-ink-400 dark:text-ink-600 mt-1 text-right">
              {bio.length}/160
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-ink-200 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-ink-500 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-accent-500 to-emerald-500 text-white hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-accent-500/20"
          >
            <Check className="h-4 w-4" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
