import { CoverWall } from './components/CoverWall';
import { PlayerBar } from './components/PlayerBar';
import { mockAlbums } from './data/mock';
import { usePlayerStore } from './stores/usePlayerStore';

function App() {
  const { play } = usePlayerStore();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      {/* Sidebar/Header Placeholder (Optional for now, keeping it clean) */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-black/50 border-b border-white/5">
        <div className="flex h-14 items-center px-8">
           <div className="font-bold text-lg tracking-wider">OpusDeck</div>
        </div>
      </header>

      <main>
        <CoverWall 
          albums={mockAlbums} 
          onAlbumClick={(album) => play(album)}
        />
      </main>

      <PlayerBar />
    </div>
  );
}

export default App;