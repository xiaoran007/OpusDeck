import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlbumCard } from '../components/AlbumCard';
import { useAuthStore } from '../stores/useAuthStore';
import { Album } from '../types';

const Section = ({ title, albums, onAlbumClick }: { title: string, albums: Album[], onAlbumClick: (a: Album) => void }) => {
    if (albums.length === 0) return null;
    return (
        <section className="mb-12">
            <div className="flex items-end justify-between mb-4 px-1">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {albums.slice(0, 5).map(album => (
                    <AlbumCard key={album.id} album={album} onClick={onAlbumClick} />
                ))}
            </div>
        </section>
    );
}

export const HomePage = () => {
  const { client, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  const [newestAlbums, setNewestAlbums] = useState<Album[]>([]);
  const [randomAlbums, setRandomAlbums] = useState<Album[]>([]);
  // const [recentAlbums, setRecentAlbums] = useState<Album[]>([]); // "recent" in subsonic means recently played

  useEffect(() => {
    const fetchData = async () => {
      if (!client || !isAuthenticated) return;
      
      try {
        // Fetch Newest
        const newestRes = await client.getAlbumList('newest', 10);
        setNewestAlbums(mapAlbums(newestRes.albumList.album || [], client));

        // Fetch Random (for "Discover")
        const randomRes = await client.getAlbumList('random', 10);
        setRandomAlbums(mapAlbums(randomRes.albumList.album || [], client));

      } catch (error) {
        console.error("Failed to fetch home data:", error);
      }
    };

    fetchData();
  }, [client, isAuthenticated]);

  const mapAlbums = (list: any[], client: any): Album[] => {
      return list.map((item: any) => ({
          id: item.id,
          title: item.title || item.name, 
          artist: item.artist,
          year: item.year,
          genre: item.genre,
          songCount: item.songCount || 0,
          coverArt: client.getCoverArtUrl(item.id)
      }));
  }

  return (
    <div className="p-8 max-w-[1920px] mx-auto pb-24">
        {/* Welcome Header */}
        <h1 className="text-4xl font-bold mb-8 text-white">Listen Now</h1>

        {isAuthenticated ? (
            <>
                <Section 
                    title="New Releases" 
                    albums={newestAlbums} 
                    onAlbumClick={(a) => navigate(`/album/${a.id}`)} 
                />
                
                <Section 
                    title="Discover Something New" 
                    albums={randomAlbums} 
                    onAlbumClick={(a) => navigate(`/album/${a.id}`)} 
                />
            </>
        ) : (
             <div className="text-center py-20">
                <h2 className="text-2xl font-semibold mb-4">Welcome to OpusDeck</h2>
                <p className="text-neutral-400">Please login to access your library.</p>
             </div>
        )}
    </div>
  );
};
