# Lexica Dictionary

A polished, OC-themed dictionary PWA built around fast word lookup and personal vocabulary workflows. The interface demonstrates API-backed definitions, saved-word persistence, search history, profile customization, and light/dark theming inside an installable mobile-friendly dictionary experience.

> [!NOTE]
> [Live demo coming soon](#)

## Preview




## Features

- Free Dictionary API integration with typed success and error states
- Search-first dictionary interface with loading skeletons, empty states, and actionable error recovery
- Multi-definition word cards with phonetics, meanings, examples, and related word interactions
- Saved words workflow backed by localStorage with quick remove and restore behavior
- Search history workflow with capped history, individual removal, and clear-all handling
- Profile modal with locally persisted name, bio, and avatar data
- Dark/light theme switching with persistent theme state and PWA-ready metadata
- Fixed Ravenick portfolio badge with logo lockup and sheen animation
- Portfolio-ready SEO metadata authored for Nelson Emmanuel | Ravenick

## Built With

| Tool           | Use                                                |
| -------------- | -------------------------------------------------- |
| React 18       | Stateful dictionary views and profile interactions  |
| TypeScript     | Typed dictionary entries, local data, and UI states |
| Tailwind CSS 3 | Responsive styling, theme tokens, and dark mode     |
| Lucide React   | Interface icons and navigation symbols             |
| Vite PWA       | Installable app manifest and service worker output  |
| Vite           | Production compilation and development runtime      |

## Project Structure
```text
src/
  components/
    EmptyState.tsx
    ErrorState.tsx
    History.tsx
    LoadingSkeleton.tsx
    ProfileModal.tsx
    RavenickBadge.tsx
    SavedWords.tsx
    SearchBar.tsx
    ThemeToggle.tsx
    WordCard.tsx
  hooks/
    useTheme.ts
  lib/
    dictionary.ts
    storage.ts
  App.tsx
  index.css
  main.tsx
  types.ts
public/
  favicon.svg
  icon.svg
  icon-192.png
  icon-512.png
  oc-logo-no-bg.png
```

## Run Locally
```bash
git clone https://github.com/Ravenick/lexica-dictionary.git
cd "lexica-dictionary"
npm install
npm run dev
```

Create a production build with:
```bash
npm run build
```

## Author

Nelson Emmanuel | Raven
