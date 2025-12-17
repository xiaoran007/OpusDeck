import { Album } from '../types';
import { AlbumCard } from './AlbumCard';

interface CoverWallProps {
  albums: Album[];
  onAlbumClick: (album: Album) => void;
}

export const CoverWall = ({ albums, onAlbumClick }: CoverWallProps) => {
  return (
    <div className="p-8 pb-32 w-full max-w-[1800px] mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-white tracking-tight">Library</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-x-6 gap-y-10">
        {albums.map((album) => (
          <AlbumCard 
            key={album.id} 
            album={album} 
            onClick={onAlbumClick}
          />
        ))}
      </div>
    </div>
  );
};
