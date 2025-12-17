import { create } from 'zustand';
import type { Album } from '../data/mockData';

interface PlayerState {
  currentAlbum: Album | null;
  isPlaying: boolean;
  playAlbum: (album: Album) => void;
  togglePlay: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentAlbum: null,
  isPlaying: false,
  playAlbum: (album) => set({ currentAlbum: album, isPlaying: true }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
}));
