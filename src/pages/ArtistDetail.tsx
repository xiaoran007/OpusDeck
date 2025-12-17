import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { Album } from '../types';
import { AlbumCard } from '../components/AlbumCard';

export const ArtistDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { client, isAuthenticated } = useAuthStore();
  
  const [artistName, setArtistName] = useState('');
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!client || !isAuthenticated || !id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await client.getArtist(id);
        const data = res.artist;
        setArtistName(data.name);
        
        const rawAlbums = data.album || [];
        const mappedAlbums: Album[] = rawAlbums.map((item: any) => ({
          id: item.id,
          title: item.title || item.name, 
          artist: item.artist, // Should be same as artistName
          year: item.year,
          genre: item.genre,
          songCount: item.songCount || 0,
          coverArt: client.getCoverArtUrl(item.id)
        }));
        
        setAlbums(mappedAlbums);

      } catch (err) {
        console.error("Failed to load artist details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, client, isAuthenticated]);

  if (loading) return <div className="p-8 text-neutral-500">Loading artist...</div>;

  return (
    <div className="min-h-full pb-10">
        {/* Header */}
        <div className="bg-gradient-to-b from-neutral-800 to-[#1e1e1e] pt-10 pb-8 px-8 mb-6">
            <button 
                onClick={() => navigate(-1)}
                className="mb-6 p-2 rounded-full hover:bg-white/10 text-white transition-colors"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-neutral-700 flex items-center justify-center shadow-2xl">
                    <User className="w-10 h-10 text-neutral-400" />
                </div>
                <div>
                    <h1 className="text-5xl font-bold text-white mb-2">{artistName}</h1>
                    <p className="text-neutral-400">{albums.length} Albums</p>
                </div>
            </div>
        </div>

        <div className="px-8 max-w-[1920px] mx-auto">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-2">Albums</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                {albums.map((album) => (
                  <AlbumCard 
                    key={album.id} 
                    album={album} 
                    onClick={(a) => navigate(`/album/${a.id}`)}
                  />
                ))}
            </div>
        </div>
    </div>
  );
};
