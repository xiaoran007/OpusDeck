import React from 'react';
import { Sidebar } from './components/Sidebar';
import { PlayerBar } from './components/PlayerBar';
import { AlbumCard } from './components/AlbumCard';
import { albums } from './data/mockData';
import { usePlayerStore } from './store/useStore';

function App() {
  const { currentAlbum } = usePlayerStore();

  return (
    <div className="flex h-screen bg-app-bg text-white font-sans overflow-hidden selection:bg-accent/30 selection:text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
        {/* Header / Top Bar area could go here */}
        
        {/* Scrollable Content */}
        <main className={`flex-1 overflow-y-auto p-8 ${currentAlbum ? 'pb-24' : ''}`}>
          <div className="max-w-[1920px] mx-auto">
            <header className="mb-8 flex items-end justify-between border-b border-white/10 pb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Recently Added</h1>
                <p className="text-neutral-400 text-sm">Your latest classical acquisitions</p>
              </div>
              <div className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
                {albums.length} Albums
              </div>
            </header>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
              {albums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Player Overlay */}
      <PlayerBar />
    </div>
  );
}

export default App;