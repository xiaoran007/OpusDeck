import { create } from 'zustand';
import { Album, Song } from '../types';

interface PlayerState {
  // UI State
  isQueueOpen: boolean;

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
  toggleQueue: () => void;
  
  // Queue Management
  playAlbum: (album: Album, songs: Song[], startIndex?: number) => void;
  playSong: (song: Song) => void;
  next: () => void;
  prev: () => void;
  jumpTo: (index: number) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;

  // Internal (called by AudioController)
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsLoading: (loading: boolean) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  isQueueOpen: false,

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
  seek: (time) => set({ currentTime: time, seekRequest: time }),
  toggleQueue: () => set((state) => ({ isQueueOpen: !state.isQueueOpen })),

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

  jumpTo: (index) => {
      const { queue } = get();
      if (index >= 0 && index < queue.length) {
          set({
              currentIndex: index,
              currentSong: queue[index],
              isPlaying: true,
              currentTime: 0,
              duration: 0
          });
      }
  },

  removeFromQueue: (index) => {
      const { queue, currentIndex } = get();
      const newQueue = [...queue];
      newQueue.splice(index, 1);
      
      let newIndex = currentIndex;
      // If we removed the currently playing song, what to do?
      // Usually play the next one (which is now at the same index)
      // If we removed a song BEFORE current, current index needs to decrement
      
      if (index < currentIndex) {
          newIndex--;
      } else if (index === currentIndex) {
          // If we removed current, play next (which falls into newIndex)
          // Unless it was the last song
          if (newQueue.length === 0) {
              set({ 
                  queue: [], 
                  currentSong: null, 
                  currentIndex: -1, 
                  isPlaying: false 
              });
              return;
          }
          if (newIndex >= newQueue.length) {
              newIndex = 0; // Loop back or stop? Let's stop effectively or go to start
              // Better: just stop if we killed the last song
              // For simplicity, let's just update queue. Audio might continue playing until track ends, 
              // but state would be mismatched. 
              // Let's force update current song.
          }
      }

      // Sync state
      const nextSong = newQueue[newIndex];
      // If we changed the current song (because we removed it)
      if (index === currentIndex) {
           set({
               queue: newQueue,
               currentIndex: newIndex,
               currentSong: nextSong,
               // Keep playing if we removed current? Maybe.
           });
      } else {
          set({
              queue: newQueue,
              currentIndex: newIndex
          });
      }
  },

  clearQueue: () => {
      set({
          queue: [],
          currentIndex: -1,
          currentSong: null,
          isPlaying: false
      });
  },

  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));