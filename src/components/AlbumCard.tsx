import { Play } from 'lucide-react';
import { Album } from '../types';

interface AlbumCardProps {
  album: Album;
  onClick: (album: Album) => void;
}

export const AlbumCard = ({ album, onClick }: AlbumCardProps) => {
  return (
    <div 
      className="group relative flex flex-col gap-3 cursor-pointer"
      onClick={() => onClick(album)}
    >
      <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-800 shadow-lg group-hover:shadow-xl transition-all duration-300">
        <img 
          src={album.coverArt} 
          alt={album.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Play Overlay - Apple Style */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
             {/* Red Play Button */}
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform">
               <Play className="w-5 h-5 fill-white text-white translate-x-0.5" />
            </div>
        </div>
      </div>

      <div className="flex flex-col gap-0.5">
        <h3 className="font-medium text-[13px] text-white leading-tight truncate" title={album.title}>
          {album.title}
        </h3>
        <p className="text-[13px] text-neutral-400 truncate" title={album.artist}>
          {album.artist}
        </p>
      </div>
    </div>
  );
};