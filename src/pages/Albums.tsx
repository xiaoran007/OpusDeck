import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlbumCard } from '../components/AlbumCard';
import { useAuthStore } from '../stores/useAuthStore';
import { Album } from '../types';
import { Loader2 } from 'lucide-react';

const PAGE_SIZE = 50;

export const AlbumsPage = () => {
  const { isAuthenticated, client } = useAuthStore();
  const navigate = useNavigate();
  
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  // Observer for infinite scroll
  const observer = useRef<IntersectionObserver | null>(null);
  
  // Callback ref for the last element in the list
  const lastAlbumElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setOffset(prevOffset => prevOffset + PAGE_SIZE);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  // Reset state when auth changes
  useEffect(() => {
    setAlbums([]);
    setOffset(0);
    setHasMore(true);
  }, [client, isAuthenticated]);

  // Fetch data effect
  useEffect(() => {
    const fetchAlbums = async () => {
      if (!client || !isAuthenticated) return;
      
      // Prevent fetching if we're done (unless it's the initial load offset 0)
      if (!hasMore && offset > 0) return;
      
      setIsLoading(true);
      try {
        const res = await client.getAlbumList('alphabeticalByName', PAGE_SIZE, offset); 
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
        
        setAlbums(prev => {
            // If offset is 0, replace entire list (fresh load)
            if (offset === 0) return mappedAlbums;
            // Otherwise append
            return [...prev, ...mappedAlbums];
        });
        
        // If we got fewer items than requested, we've reached the end
        setHasMore(apiAlbums.length === PAGE_SIZE);
      } catch (error) {
        console.error("Failed to fetch albums:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbums();
  }, [client, isAuthenticated, offset]);

  return (
    <div className="p-8 max-w-[1920px] mx-auto">
      <header className="mb-8 flex items-end justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
            Albums
          </h1>
          <p className="text-neutral-400 text-sm">
            All Albums from your server
          </p>
        </div>
        <div className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
          {albums.length} Albums (A-Z)
        </div>
      </header>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {albums.map((album, index) => {
            if (albums.length === index + 1) {
                // Attach ref to last element to trigger load more
                return (
                    <div ref={lastAlbumElementRef} key={`${album.id}-${index}`} className="contents">
                        <AlbumCard 
                          album={album} 
                          onClick={(album) => navigate(`/album/${album.id}`)}
                        />
                    </div>
                );
            } else {
                return (
                    <AlbumCard 
                      key={`${album.id}-${index}`} 
                      album={album} 
                      onClick={(album) => navigate(`/album/${album.id}`)}
                    />
                );
            }
          })}
      </div>

      {isLoading && (
        <div className="text-center py-10 text-neutral-500 flex justify-center w-full">
            <Loader2 className="animate-spin" />
        </div>
      )}
      
      {!hasMore && albums.length > 0 && (
          <div className="text-center py-10 text-neutral-600 text-sm italic w-full">
              You've reached the end of your library.
          </div>
      )}
    </div>
  );
};