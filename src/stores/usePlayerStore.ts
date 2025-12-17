import { create } from 'zustand';
import { Album, Song } from '../types';

interface PlayerState {
  isPlaying: boolean;
  currentSong: Song | null;
  currentAlbum: Album | null;
  volume: number;
  play: (album: Album) => void;
  pause: () => void;
  resume: () => void;
  setVolume: (vol: number) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  currentSong: null,
  currentAlbum: null,
  volume: 0.8,
  play: (album) => set({ 
    isPlaying: true, 
    currentAlbum: album,
    // Mock playing the first song
    currentSong: {
      id: '1',
      title: 'Allegro',
      artist: album.artist,
      album: album.title,
      duration: 300,
      trackNumber: 1
    }
  }),
  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),
  setVolume: (volume) => set({ volume }),
}));
