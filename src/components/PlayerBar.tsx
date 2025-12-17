import { Play, Pause, SkipBack, SkipForward, Volume2, ListMusic, Maximize2 } from 'lucide-react';
import { usePlayerStore } from '../stores/usePlayerStore';

export const PlayerBar = () => {
  const { isPlaying, currentSong, currentAlbum, pause, resume } = usePlayerStore();

  if (!currentSong || !currentAlbum) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-neutral-900/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-between px-6 z-50">
      {/* Track Info */}
      <div className="flex items-center gap-4 w-1/3">
        <div className="w-12 h-12 rounded bg-neutral-800 shadow-lg overflow-hidden relative group">
           <img src={currentAlbum.coverArt} alt="Cover" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors cursor-pointer flex items-center justify-center">
             <Maximize2 className="w-5 h-5 text-transparent group-hover:text-white transition-colors" />
           </div>
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-medium text-white truncate">{currentSong.title}</span>
          <span className="text-xs text-neutral-400 truncate">{currentSong.artist}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center justify-center gap-1 w-1/3">
        <div className="flex items-center gap-6">
          <button className="text-neutral-400 hover:text-white transition-colors">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          
          <button 
            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
            onClick={isPlaying ? pause : resume}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
            )}
          </button>

          <button className="text-neutral-400 hover:text-white transition-colors">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>
        {/* Progress Bar Mock */}
        <div className="w-full max-w-md h-1 bg-neutral-700 rounded-full overflow-hidden mt-2 group cursor-pointer">
          <div className="h-full w-1/3 bg-white/80 group-hover:bg-green-500 transition-colors rounded-full" />
        </div>
      </div>

      {/* Volume & Extras */}
      <div className="flex items-center justify-end gap-4 w-1/3">
        <button className="text-neutral-400 hover:text-white transition-colors">
          <ListMusic className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 group">
          <Volume2 className="w-5 h-5 text-neutral-400" />
          <div className="w-24 h-1 bg-neutral-700 rounded-full overflow-hidden">
             <div className="h-full w-3/4 bg-neutral-400 group-hover:bg-white transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
};
