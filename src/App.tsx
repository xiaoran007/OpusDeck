import { AlbumCard } from './components/AlbumCard';
import { PlayerBar } from './components/PlayerBar';
import { Sidebar } from './components/Sidebar';
import { mockAlbums } from './data/mock';
import { usePlayerStore } from './stores/usePlayerStore';

function App() {
  const { play } = usePlayerStore();

  return (
    <div className="flex h-screen w-screen bg-background text-white overflow-hidden font-sans">
      
      {/* Sidebar - Fixed Left */}
      <Sidebar />

      {/* Main Content - Fluid Right */}
      <main className="flex-1 h-full overflow-y-auto relative scrollbar-thin">
        <div className="p-8 pb-32 max-w-[1920px] mx-auto">
          
          {/* Header Section */}
          <div className="flex items-end justify-between mb-6 border-b border-white/10 pb-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Recently Added</h1>
            </div>
            {/* Optional: Filter controls could go here */}
          </div>
          
          {/* Album Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
            {mockAlbums.map((album) => (
              <AlbumCard 
                key={album.id} 
                album={album} 
                onClick={(album) => play(album)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Player Bar - Fixed Bottom */}
      <PlayerBar />
    </div>
  );
}

export default App;
