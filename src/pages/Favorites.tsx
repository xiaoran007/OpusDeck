import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { Album } from '../types';
import { AlbumCard } from '../components/AlbumCard';
import { Loader2, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FavoritesPage = () => {
  const { client } = useAuthStore();
  const navigate = useNavigate();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStarred = async () => {
      if (!client) return;
      try {
        const res = await client.getStarred();
        // Navidrome returns starred albums in res.starred.album
        const list = (res.starred?.album || []).map((a: any) => ({
            id: a.id,
            title: a.title || a.name, // Sometimes API uses name
            artist: a.artist,
            coverArt: client.getCoverArtUrl(a.id),
            year: a.year,
            songCount: a.songCount
        }));
        setAlbums(list);
      } catch (err) {
        console.error("Failed to fetch favorites", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStarred();
  }, [client]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-neutral-500" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1920px] mx-auto">
      <header className="mb-8 flex items-end justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
            Favorites
          </h1>
          <p className="text-neutral-400 text-sm">
            Albums you've starred
          </p>
        </div>
        <div className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
          {albums.length} Albums
        </div>
      </header>
      
      {albums.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-neutral-500 space-y-4">
              <Heart size={48} className="text-neutral-700" />
              <div className="text-center">
                <p className="text-lg font-medium text-neutral-400">No favorite albums yet</p>
                <p className="text-sm mt-1">Star an album to add it to your collection.</p>
              </div>
          </div>
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
