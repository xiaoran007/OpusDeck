import { Play } from 'lucide-react';
import { Album } from '../types';

interface AlbumCardProps {
  album: Album;
  onClick: (album: Album) => void;
}

export const AlbumCard = ({ album, onClick }: AlbumCardProps) => {
  return (
    <div 
      className="group relative flex flex-col gap-2 cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
      onClick={() => onClick(album)}
    >
      <div className="relative aspect-square rounded-lg overflow-hidden shadow-md bg-neutral-800">
        <img 
          src={album.coverArt} 
          alt={album.title}
          className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
          loading="lazy"
        />
        
        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white hover:scale-110 transition-transform">
            <Play className="w-8 h-8 fill-current translate-x-0.5" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-0.5 px-0.5">
        <h3 className="font-medium text-sm text-white leading-tight truncate" title={album.title}>
          {album.title}
        </h3>
        <p className="text-xs text-neutral-400 truncate" title={album.artist}>
          {album.artist}
        </p>
        <p className="text-[10px] text-neutral-500 uppercase tracking-wider">
          {album.year} • {album.genre}
        </p>
      </div>
    </div>
  );
};
