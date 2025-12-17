import React from 'react';
import { Play } from 'lucide-react';
import type { Album } from '../data/mockData';
import { usePlayerStore } from '../store/useStore';

interface AlbumCardProps {
  album: Album;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
  const { playAlbum, currentAlbum, isPlaying } = usePlayerStore();
  const isCurrent = currentAlbum?.id === album.id;

  return (
    <div className="group flex flex-col space-y-3 cursor-pointer p-3 rounded-xl hover:bg-white/5 transition-colors duration-300">
      <div className="relative aspect-square overflow-hidden rounded-lg shadow-lg group-hover:shadow-2xl transition-all duration-300">
        <img 
          src={album.coverUrl} 
          alt={album.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Play Overlay */}
        <div 
          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200 ${isCurrent && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          onClick={() => playAlbum(album)}
        >
          <div className="w-12 h-12 bg-accent/90 rounded-full flex items-center justify-center backdrop-blur-sm hover:scale-105 transition-transform">
            <Play fill="white" className="ml-1 text-white" size={20} />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-white truncate text-[15px] leading-tight" title={album.title}>
          {album.title}
        </h3>
        <p className="text-neutral-400 text-sm truncate" title={album.artist}>
          {album.artist}
        </p>
        <p className="text-neutral-500 text-xs">
          {album.year}
        </p>
      </div>
    </div>
  );
};
