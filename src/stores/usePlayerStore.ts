import { create } from 'zustand';
import { Album, Song } from '../types';

interface PlayerState {
  // Playback State
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  
  // Seek State
  seekRequest: number | null; // Timestamp to seek to

  // Data State
  currentSong: Song | null;
  currentAlbum: Album | null;
  queue: Song[];
  currentIndex: number;

  // Actions
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setVolume: (vol: number) => void;
  seek: (time: number) => void;
  
  // Queue Management
  playAlbum: (album: Album, songs: Song[], startIndex?: number) => void;
  playSong: (song: Song) => void;
  next: () => void;
  prev: () => void;

  // Internal (called by AudioController)
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsLoading: (loading: boolean) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  isPlaying: false,
  isLoading: false,
  volume: 1, 
  currentTime: 0,
  duration: 0,
  seekRequest: null,
  
  currentSong: null,
  currentAlbum: null,
  queue: [],
  currentIndex: -1,

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  setVolume: (volume) => set({ volume }),
  
  // When UI calls seek, we update current time immediately (for visual feedback)
  // AND set a seekRequest that AudioController listens to.
  seek: (time) => set({ currentTime: time, seekRequest: time }),

  playAlbum: (album, songs, startIndex = 0) => {
    if (songs.length === 0) return;
    set({
      currentAlbum: album,
      queue: songs,
      currentIndex: startIndex,
      currentSong: songs[startIndex],
      isPlaying: true,
      currentTime: 0,
      duration: 0
    });
  },

  playSong: (song) => {
     set({
       currentSong: song,
       queue: [song],
       currentIndex: 0,
       isPlaying: true,
       currentTime: 0,
       duration: 0
     });
  },

  next: () => {
    const { queue, currentIndex } = get();
    if (currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      set({
        currentIndex: nextIndex,
        currentSong: queue[nextIndex],
        isPlaying: true,
        currentTime: 0,
        duration: 0 // Reset duration for new song
      });
    } else {
      set({ isPlaying: false });
    }
  },

  prev: () => {
    const { queue, currentIndex, currentTime } = get();
    // If > 3s, restart
    if (currentTime > 3) {
      set({ seekRequest: 0, currentTime: 0 });
      return;
    }

    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      set({
        currentIndex: prevIndex,
        currentSong: queue[prevIndex],
        isPlaying: true,
        currentTime: 0,
        duration: 0
      });
    }
  },

  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
