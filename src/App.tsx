import { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { PlayerBar } from './components/PlayerBar';
import { AlbumCard } from './components/AlbumCard';
import { LoginModal } from './components/LoginModal';
import { AudioController } from './components/AudioController';
import { usePlayerStore } from './stores/usePlayerStore';
import { useAuthStore } from './stores/useAuthStore';
import { Album } from './types';
import { mockAlbums } from './data/mock';

function App() {
  const { currentAlbum, playAlbum } = usePlayerStore();
  const { initialize, isAuthenticated, client } = useAuthStore();
  
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const fetchAlbums = async () => {
      if (!client || !isAuthenticated) return;
      
      setIsLoading(true);
      try {
        const res = await client.getAlbumList('newest', 20);
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

  const displayAlbums = isAuthenticated ? albums : mockAlbums;

  // Handle Play Click (Fetch details then play)
  const handlePlayAlbum = async (album: Album) => {
    if (!client || !isAuthenticated) {
       // Mock play for unauthenticated
       return; 
    }
    
    try {
        console.log("Fetching album details for:", album.id);
        // Fetch Album Details (to get songs)
        const res = await client.getAlbum(album.id);
        console.log("Album details:", res);
        
        let rawSongs = res.album.song || [];
        // Handle single song object response from Subsonic
        if (!Array.isArray(rawSongs)) {
            rawSongs = [rawSongs];
        }
        
        // Map songs to our type
        const mappedSongs = rawSongs.map((s: any) => ({
            id: s.id,
            title: s.title,
            artist: s.artist,
            album: s.album,
            duration: s.duration,
            trackNumber: s.track,
        }));
        
        console.log("Mapped songs:", mappedSongs);

        if (mappedSongs.length > 0) {
            playAlbum(album, mappedSongs);
        } else {
            console.warn("No songs found in album");
        }
    } catch (e) {
        console.error("Failed to play album", e);
    }
  };

  return (
    <div className="flex h-screen bg-app-bg text-white font-sans overflow-hidden selection:bg-accent/30 selection:text-white">
      <LoginModal />
      <AudioController />
      
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
                  <AlbumCard 
                    key={album.id} 
                    album={album} 
                    onClick={() => handlePlayAlbum(album)}
                  />
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