import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, List, Speaker, Loader2 } from 'lucide-react';
import { usePlayerStore } from '../stores/usePlayerStore';

const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const PlayerBar = () => {
  const { 
    currentAlbum, 
    currentSong, 
    isPlaying, 
    isLoading,
    currentTime, 
    duration, 
    volume,
    togglePlay, 
    next, 
    prev,
    seek,
    setVolume
  } = usePlayerStore();

  if (!currentSong || !currentAlbum) return null;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    seek(time); // Update store state
    
    // We also need to tell the audio element to seek. 
    // Currently AudioController listens to currentTime... wait.
    // AudioController logic in Step 2 only updates currentTime FROM audio.
    // It doesn't listen to currentTime state TO seek audio (that would cause loop).
    // FIX: We need a specific 'seek' action or useEffect in AudioController.
    // Or simpler: access the audio element directly? No, separation of concerns.
    
    // Let's modify AudioController to handle seeking via a specific trigger, 
    // OR we can just hack it here by accessing the global audio if we exposed it, 
    // BUT the cleanest way is adding a `seekTo` state or method in store.
    
    // Actually, let's inject the seek logic directly into AudioController via a ref or event,
    // OR update AudioController to listen to a 'seekRequest' timestamp in store.
    
    // FOR NOW: Let's use the method: 
    // AudioController will expose a global event or we use a store flag.
    // Let's go with updating the store `currentTime` and having AudioController 
    // distinguish between "update from audio" and "update from UI".
    // Since that's complex, I will update AudioController in next step to handle this.
    
    // Update: I will implement a robust seek mechanism in AudioController using a timestamp ref check.
  };
  
  // Progress percentage for the gradient background
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[88px] bg-[#1e1e1e]/85 backdrop-blur-xl border-t border-white/5 px-6 grid grid-cols-3 items-center z-50 select-none">
      
      {/* Track Info */}
      <div className="flex items-center space-x-4 min-w-0">
        <div className="w-12 h-12 rounded-md overflow-hidden shadow-md bg-neutral-800 flex-shrink-0 relative group">
          <img src={currentAlbum.coverArt} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20 hidden group-hover:flex items-center justify-center">
              {/* Expand/Maximize icon could go here */}
          </div>
        </div>
        <div className="min-w-0 overflow-hidden">
          <h4 className="text-sm font-medium text-white truncate" title={currentSong.title}>{currentSong.title}</h4>
          <p className="text-xs text-neutral-400 truncate hover:text-white transition-colors cursor-pointer" title={currentSong.artist}>
            {currentSong.artist}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center justify-center space-y-1">
        <div className="flex items-center space-x-6">
          <button className="text-neutral-400 hover:text-accent transition-colors disabled:opacity-50">
            <Shuffle size={18} />
          </button>
          
          <button 
            className="text-white hover:text-neutral-300 transition-colors active:scale-95"
            onClick={prev}
          >
            <SkipBack fill="white" size={24} />
          </button>
          
          <button 
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
            onClick={togglePlay}
          >
            {isLoading ? (
               <Loader2 className="animate-spin text-black" size={20} />
            ) : isPlaying ? (
              <Pause fill="black" className="text-black" size={20} />
            ) : (
              <Play fill="black" className="text-black ml-1" size={20} />
            )}
          </button>
          
          <button 
            className="text-white hover:text-neutral-300 transition-colors active:scale-95"
            onClick={next}
          >
            <SkipForward fill="white" size={24} />
          </button>
          
          <button className="text-neutral-400 hover:text-accent transition-colors">
            <Repeat size={18} />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full max-w-md flex items-center space-x-2 text-[10px] text-neutral-500 font-medium font-variant-numeric tabular-nums">
          <span className="w-8 text-right">{formatTime(currentTime)}</span>
          
          <div className="group relative flex-1 h-4 flex items-center">
            <input
              type="range"
              min={0}
              max={duration || 100} // Avoid div by zero
              value={currentTime}
              // We need to implement the seek action logic in AudioController to make this work
              onChange={handleSeek} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-full h-1 bg-neutral-600 rounded-full overflow-hidden pointer-events-none">
              <div 
                className="h-full bg-neutral-400 group-hover:bg-accent transition-colors rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {/* Thumb - only visible on hover (simulated) */}
            <div 
                className="absolute h-3 w-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ left: `${progressPercent}%`, transform: 'translateX(-50%)' }}
            />
          </div>
          
          <span className="w-8 text-left">-{formatTime(duration - currentTime)}</span>
        </div>
      </div>

      {/* Volume / Extras */}
      <div className="flex items-center justify-end space-x-4">
        <button className="text-neutral-400 hover:text-white">
          <List size={20} />
        </button>
        <div className="flex items-center space-x-2 w-28 group">
          {volume === 0 ? <Speaker size={20} className="text-neutral-500"/> : <Volume2 size={20} className="text-neutral-400" />}
          
          <div className="relative flex-1 h-4 flex items-center">
             <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-full h-1 bg-neutral-600 rounded-full overflow-hidden pointer-events-none">
               <div 
                 className="h-full bg-neutral-400 group-hover:bg-white transition-colors"
                 style={{ width: `${volume * 100}%` }}
               />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};