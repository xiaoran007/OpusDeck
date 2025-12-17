import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, List } from 'lucide-react';
import { usePlayerStore } from '../store/useStore';

export const PlayerBar = () => {
  const { currentAlbum, isPlaying, togglePlay } = usePlayerStore();

  if (!currentAlbum) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[88px] bg-[#1e1e1e]/85 backdrop-blur-xl border-t border-white/5 px-6 grid grid-cols-3 items-center z-50">
      
      {/* Track Info */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-md overflow-hidden shadow-md bg-neutral-800">
          <img src={currentAlbum.coverUrl} alt="Cover" className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-white line-clamp-1">{currentAlbum.title}</h4>
          <p className="text-xs text-neutral-400 line-clamp-1">{currentAlbum.artist}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center justify-center space-y-1">
        <div className="flex items-center space-x-6">
          <button className="text-neutral-400 hover:text-white transition-colors">
            <Shuffle size={18} />
          </button>
          <button className="text-white hover:text-neutral-300 transition-colors">
            <SkipBack fill="white" size={24} />
          </button>
          <button 
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause fill="black" className="text-black" size={20} />
            ) : (
              <Play fill="black" className="text-black ml-1" size={20} />
            )}
          </button>
          <button className="text-white hover:text-neutral-300 transition-colors">
            <SkipForward fill="white" size={24} />
          </button>
          <button className="text-neutral-400 hover:text-white transition-colors">
            <Repeat size={18} />
          </button>
        </div>
        {/* Progress Bar (Visual Only) */}
        <div className="w-full max-w-md flex items-center space-x-2 text-[10px] text-neutral-500 font-medium">
          <span>0:45</span>
          <div className="flex-1 h-1 bg-neutral-600 rounded-full overflow-hidden">
            <div className="w-1/3 h-full bg-neutral-400 rounded-full"></div>
          </div>
          <span>-3:12</span>
        </div>
      </div>

      {/* Volume / Extras */}
      <div className="flex items-center justify-end space-x-4">
        <button className="text-neutral-400 hover:text-white">
          <List size={20} />
        </button>
        <div className="flex items-center space-x-2 w-32 group">
          <Volume2 size={20} className="text-neutral-400" />
          <div className="flex-1 h-1 bg-neutral-600 rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-neutral-400 group-hover:bg-white transition-colors rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
