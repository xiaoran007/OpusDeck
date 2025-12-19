import { X, Trash2, Play } from 'lucide-react';
import { usePlayerStore } from '../stores/usePlayerStore';
import { Song } from '../types';

export const QueueDrawer = () => {
  const { 
    isQueueOpen, 
    toggleQueue, 
    queue, 
    currentIndex, 
    jumpTo, 
    removeFromQueue, 
    clearQueue 
  } = usePlayerStore();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Backdrop (Click to close) */}
      {isQueueOpen && (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity"
            onClick={toggleQueue}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed right-0 top-0 bottom-[88px] w-full md:w-96 bg-[#1e1e1e]/95 backdrop-blur-xl border-l border-white/10 z-40 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${isQueueOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-[#1e1e1e]">
          <h2 className="text-xl font-bold text-white">Up Next</h2>
          <div className="flex items-center gap-2">
            <button 
                onClick={clearQueue}
                className="p-2 text-neutral-400 hover:text-red-500 transition-colors rounded-full hover:bg-white/5"
                title="Clear Queue"
            >
                <Trash2 size={18} />
            </button>
            <button 
                onClick={toggleQueue}
                className="p-2 text-neutral-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
            >
                <X size={20} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4">
          {queue.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-neutral-500 space-y-2">
              <p>Your queue is empty.</p>
              <p className="text-xs">Play some music to get started!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {queue.map((song: Song, index: number) => {
                const isCurrent = index === currentIndex;
                
                return (
                  <div 
                    key={`${song.id}-${index}`}
                    className={`group flex items-center p-2 rounded-lg gap-3 select-none transition-colors ${isCurrent ? 'bg-white/10' : 'hover:bg-white/5'}`}
                  >
                    {/* Hover Play Button / Index */}
                    <div 
                        className="w-8 h-8 flex items-center justify-center flex-shrink-0 cursor-pointer text-neutral-400 group-hover:text-white"
                        onClick={() => jumpTo(index)}
                    >
                         {isCurrent ? (
                             <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                         ) : (
                             <Play size={14} className="opacity-0 group-hover:opacity-100 fill-current" />
                         )}
                         {!isCurrent && <span className="text-xs font-medium tabular-nums group-hover:hidden">{index + 1}</span>}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center cursor-default" onDoubleClick={() => jumpTo(index)}>
                      <p className={`text-sm font-medium truncate ${isCurrent ? 'text-accent' : 'text-white'}`}>
                          {song.title}
                      </p>
                      <p className="text-xs text-neutral-500 truncate">{song.artist}</p>
                    </div>

                    {/* Duration / Remove */}
                    <div className="text-xs text-neutral-500 tabular-nums flex items-center">
                        <span className="group-hover:hidden">{formatDuration(song.duration)}</span>
                        <button 
                            className="hidden group-hover:block text-neutral-500 hover:text-red-500 p-1"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeFromQueue(index);
                            }}
                        >
                            <X size={14} />
                        </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
