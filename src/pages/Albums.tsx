import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlbumCard } from '../components/AlbumCard';
import { useAuthStore } from '../stores/useAuthStore';
import { Album } from '../types';

export const AlbumsPage = () => {
  const { isAuthenticated, client } = useAuthStore();
  const navigate = useNavigate();
  
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAlbums = async () => {
      if (!client || !isAuthenticated) return;
      
      setIsLoading(true);
      try {
        // Fetch a large chunk of albums, sorted alphabetically
        // 'alphabeticalByName' is standard Subsonic
        const res = await client.getAlbumList('alphabeticalByName', 100); 
        const apiAlbums = res.albumList.album || [];
        
        const mappedAlbums: Album[] = apiAlbums.map((item: any) => ({
          id: item.id,
          title: item.title || item.name, 
          artist: item.artist,
          year: item.year,
          genre: item.genre,
          songCount: item.songCount || 0,
          coverArt: client.getCoverArtUrl(item.id)
        }));
        
        setAlbums(mappedAlbums);
      } catch (error) {
        console.error("Failed to fetch albums:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbums();
  }, [client, isAuthenticated]);

  return (
    <div className="p-8 max-w-[1920px] mx-auto">
      <header className="mb-8 flex items-end justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
            Albums
          </h1>
        </div>
        <div className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
          {albums.length} Albums (A-Z)
        </div>
      </header>
      
      {isLoading ? (
        <div className="text-center py-20 text-neutral-500">Loading library...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {albums.map((album) => (
            <AlbumCard 
              key={album.id} 
              album={album} 
              onClick={(album) => navigate(`/album/${album.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
