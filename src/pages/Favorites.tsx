import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { Album } from '../types';
import { AlbumCard } from '../components/AlbumCard';
import { Loader2, Heart } from 'lucide-react';

export const FavoritesPage = () => {
  const { client } = useAuthStore();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStarred = async () => {
      if (!client) return;
      try {
        const res = await client.getStarred();
        // Navidrome returns starred albums in res.starred.album
        // Map to ensure type compatibility if needed, though usually direct mapping works
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
    <div className="p-8 animate-in fade-in duration-500">
      <header className="mb-8 flex items-center gap-4 border-b border-white/5 pb-6">
        <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center text-accent shadow-[0_0_15px_rgba(250,35,59,0.2)]">
            <Heart size={28} fill="currentColor" />
        </div>
        <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Favorite Albums</h1>
            <p className="text-neutral-400 mt-1 font-medium">{albums.length} albums</p>
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
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
      )}
    </div>
  );
};
