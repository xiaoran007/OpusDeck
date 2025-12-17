import { Play, Music, Clock } from 'lucide-react';
import { Song } from '../types';
import { usePlayerStore } from '../stores/usePlayerStore';

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

interface TrackListProps {
  songs: Song[];
  onPlaySong: (index: number) => void;
  showAlbumColumn?: boolean; // Playlists need to show which album the song is from
}

export const TrackList = ({ songs, onPlaySong, showAlbumColumn = false }: TrackListProps) => {
  const { currentSong, isPlaying } = usePlayerStore();

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="text-xs text-neutral-500 border-b border-white/10">
          <th className="px-4 py-3 font-medium w-12 text-center">#</th>
          <th className="px-4 py-3 font-medium">Title</th>
          {showAlbumColumn && <th className="px-4 py-3 font-medium hidden md:table-cell">Album</th>}
          <th className="px-4 py-3 font-medium text-right w-24">
            <Clock className="w-4 h-4 ml-auto" />
          </th>
        </tr>
      </thead>
      <tbody>
        {songs.map((song, index) => {
          const isCurrentSong = currentSong?.id === song.id;

          return (
            <tr 
              key={`${song.id}-${index}`} // Index added to key because same song might appear twice in a playlist? Unlikely but safe.
              onDoubleClick={() => onPlaySong(index)}
              className={`
                group hover:bg-white/5 transition-colors cursor-default select-none rounded-lg
                ${isCurrentSong ? 'bg-white/10' : ''}
              `}
            >
              <td className="px-4 py-3 text-sm text-neutral-500 text-center w-12 rounded-l-lg group-hover:text-white">
                {isCurrentSong && isPlaying ? (
                  <Music className="w-4 h-4 mx-auto text-accent animate-pulse" />
                ) : (
                  <span className="group-hover:hidden">{index + 1}</span>
                )}
                <button 
                  className={`hidden group-hover:block mx-auto ${isCurrentSong ? 'text-accent' : 'text-white'}`}
                  onClick={() => onPlaySong(index)}
                >
                   <Play className="w-3 h-3 fill-current" />
                </button>
              </td>
              <td className="px-4 py-3">
                <div className={`text-sm font-medium truncate ${isCurrentSong ? 'text-accent' : 'text-white'}`}>
                  {song.title}
                </div>
                <div className="text-xs text-neutral-500 group-hover:text-neutral-400">
                  {song.artist}
                </div>
              </td>
              {showAlbumColumn && (
                <td className="px-4 py-3 text-sm text-neutral-400 hidden md:table-cell truncate max-w-[200px]">
                    {song.album}
                </td>
              )}
              <td className="px-4 py-3 text-sm text-neutral-500 text-right rounded-r-lg font-variant-numeric tabular-nums">
                {formatDuration(song.duration)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
