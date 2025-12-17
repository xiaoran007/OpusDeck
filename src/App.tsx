import React, { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { PlayerBar } from './components/PlayerBar';
import { AlbumCard } from './components/AlbumCard';
import { LoginModal } from './components/LoginModal';
import { usePlayerStore } from './stores/usePlayerStore';
import { useAuthStore } from './stores/useAuthStore';
import { Album } from './types';
import { mockAlbums } from './data/mock';

function App() {
  const { currentAlbum } = usePlayerStore();
  const { initialize, isAuthenticated, client } = useAuthStore();
  
  // Local state for albums (switch between mock and real)
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Initialize Auth on Mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // 2. Fetch Albums when Client is ready
  useEffect(() => {
    const fetchAlbums = async () => {
      if (!client || !isAuthenticated) return;
      
      setIsLoading(true);
      try {
        const res = await client.getAlbumList('newest', 20);
        const apiAlbums = res.albumList.album || [];
        
        // Transform API response to our App's Album type
        const mappedAlbums: Album[] = apiAlbums.map((item: any) => ({
          id: item.id,
          title: item.title || item.name, // Subsonic sometimes uses 'name' for dirs
          artist: item.artist,
          year: item.year,
          genre: item.genre,
          songCount: item.songCount || 0,
          // Generate Cover Art URL
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

  // Fallback to mock data if not authenticated (or purely for dev preview)
  // For this "Production-like" stage, we might want to show empty state instead.
  // But let's keep mock as fallback only if albums is empty AND not loading?
  // Actually, let's strictly use API data if authenticated.
  const displayAlbums = isAuthenticated ? albums : mockAlbums;

  return (
    <div className="flex h-screen bg-app-bg text-white font-sans overflow-hidden selection:bg-accent/30 selection:text-white">
      <LoginModal />
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
        
        {/* Scrollable Content */}
        <main className={`flex-1 overflow-y-auto p-8 ${currentAlbum ? 'pb-24' : ''}`}>
          <div className="max-w-[1920px] mx-auto">
            <header className="mb-8 flex items-end justify-between border-b border-white/10 pb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
                  {isAuthenticated ? 'Recently Added' : 'Demo Library'}
                </h1>
                <p className="text-neutral-400 text-sm">
                  {isAuthenticated ? 'Your latest collection from Navidrome' : 'Please login to see your music'}
                </p>
              </div>
              <div className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
                {displayAlbums.length} Albums
              </div>
            </header>
            
            {isLoading ? (
              <div className="text-center py-20 text-neutral-500">Loading library...</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                {displayAlbums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Player Overlay */}
      <PlayerBar />
    </div>
  );
}

export default App;
