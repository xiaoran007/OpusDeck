# Development Status Report - OpusDeck MVP

**Date:** 2025-12-17
**Status:** MVP Complete (v0.1.0)

## 📋 Overview
OpusDeck is a React-based frontend for Subsonic servers (developed against Navidrome). The initial MVP phase focused on establishing the architectural foundation, authentication flow, and core playback features, along with a complete library browsing experience.

## ✅ Completed Features

### 1. Core Architecture
- **Tech Stack**: React, Vite, Tailwind, Zustand, React Router.
- **API Layer**: Custom `SubsonicClient` (`src/api/subsonic.ts`) implementing auth (MD5 token) and key endpoints (Album, Artist, Playlist, Stream).
- **State Management**: 
  - `useAuthStore`: Persists connection details (URL, User, Salt/Token).
  - `usePlayerStore`: Manages global playback state (Current Song, Queue, Volume, Seek).

### 2. Playback Engine (`src/components/AudioController.tsx`)
- Headless audio component to decouple logic from UI.
- Supports Play/Pause, Seek, Volume, and Auto-advance (Next track on end).
- Handles Stream URL generation based on Subsonic protocols.

### 3. UI/UX & Routing
- **Layout**: Persistent `Sidebar` and `PlayerBar` (`RootLayout`).
- **Home**: Dashboard with "New Releases" and "Discover" sections.
- **Library**:
  - `RecentlyAddedPage`: Grid view of recent albums.
  - `ArtistsPage` & `ArtistDetailPage`: Artist index and album drill-down.
  - `AlbumsPage`: A-Z sorted album grid.
- **Playlists**: Sidebar integration and detailed view with "Play All" support.
- **Visuals**: Apple Music-inspired dark mode, glassmorphism player bar.

## 🚧 Pending / TODOs (For Next Iteration)

### High Priority
- **Search**: The search bar in Sidebar is currently visual-only. Needs to hook into `search3` endpoint.
- **Queue UI**: No visual interface to see or edit the "Up Next" queue.
- **Mobile Responsiveness**: Layout is responsive but Sidebar needs a mobile hamburger menu/drawer implementation.

### Medium Priority
- **Artist Images**: Currently uses placeholders. Need to implement `getArtistInfo` (ID3) or reliable artist art fetching.
- **User Settings**: Theme toggles (if needed), transcoding bitrate options.
- **Favoriting**: 'Star' functionality for Songs/Albums.

### Known Issues
- **Large Libraries**: `AlbumsPage` fetches 100 items. Need to implement infinite scroll or pagination for large libraries.
- **Error Handling**: Basic console logging. Needs UI toasts/alerts for API failures.

## 📂 Key Files for Context
- `src/App.tsx`: Main Router configuration.
- `src/api/subsonic.ts`: The bridge to the backend.
- `src/stores/usePlayerStore.ts`: The brain of the music player.
- `src/components/TrackList.tsx`: Reusable song table component.
