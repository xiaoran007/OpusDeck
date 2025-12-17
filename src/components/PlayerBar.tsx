import { Play, Pause, SkipBack, SkipForward, Volume2, ListMusic, Shuffle, Repeat } from 'lucide-react';
import { usePlayerStore } from '../stores/usePlayerStore';

export const PlayerBar = () => {
  const { isPlaying, currentSong, currentAlbum, pause, resume } = usePlayerStore();

  // Always render the bar to maintain layout, even if nothing playing (or use a placeholder state)
  // For this demo, we'll return null if nothing is loaded, but in a real app, it often stays visible.
  if (!currentSong || !currentAlbum) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[88px] bg-background/85 backdrop-blur-xl border-t border-white/5 flex items-center px-8 z-50 justify-between select-none">
      
      {/* Left: Track Info */}
      <div className="flex items-center gap-4 w-[30%] min-w-0">
        <div className="w-12 h-12 rounded-md bg-neutral-800 shadow-sm overflow-hidden flex-shrink-0 relative group cursor-pointer hover:opacity-80 transition-opacity">
           <img src={currentAlbum.coverArt} alt="Cover" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col overflow-hidden justify-center">
          <span className="text-sm font-medium text-white truncate cursor-default">{currentSong.title}</span>
          <span className="text-xs text-neutral-400 truncate hover:text-white hover:underline cursor-pointer transition-colors">{currentSong.artist}</span>
        </div>
      </div>

      {/* Center: Controls */}
      <div className="flex flex-col items-center justify-center gap-1.5 w-[40%]">
        <div className="flex items-center gap-6">
          <button className="text-neutral-400 hover:text-accent transition-colors">
            <Shuffle className="w-4 h-4" />
          </button>

          <button className="text-neutral-300 hover:text-white transition-colors">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          
          <button 
            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
            onClick={isPlaying ? pause : resume}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
            )}
          </button>

          <button className="text-neutral-300 hover:text-white transition-colors">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          <button className="text-neutral-400 hover:text-accent transition-colors">
            <Repeat className="w-4 h-4" />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full max-w-[480px] flex items-center gap-2 group">
          <span className="text-[10px] text-neutral-500 font-medium tabular-nums group-hover:text-neutral-300">0:24</span>
          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden relative cursor-pointer">
             <div className="absolute inset-y-0 left-0 w-1/3 bg-neutral-400 group-hover:bg-accent transition-colors rounded-full" />
          </div>
          <span className="text-[10px] text-neutral-500 font-medium tabular-nums group-hover:text-neutral-300">-3:42</span>
        </div>
      </div>

      {/* Right: Volume & Extras */}
      <div className="flex items-center justify-end gap-4 w-[30%]">
        <div className="flex items-center gap-2 group">
          <Volume2 className="w-4 h-4 text-neutral-400" />
          <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer">
             <div className="h-full w-3/4 bg-neutral-400 group-hover:bg-white transition-colors" />
          </div>
        </div>
        <button className="text-neutral-400 hover:text-accent transition-colors bg-white/5 p-1.5 rounded-lg">
          <ListMusic className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};