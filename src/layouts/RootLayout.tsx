import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { PlayerBar } from '../components/PlayerBar';
import { LoginModal } from '../components/LoginModal';
import { AudioController } from '../components/AudioController';
import { usePlayerStore } from '../stores/usePlayerStore';

export const RootLayout = () => {
  const { currentAlbum } = usePlayerStore();

  return (
    <div className="flex h-screen bg-app-bg text-white font-sans overflow-hidden selection:bg-accent/30 selection:text-white">
      <LoginModal />
      <AudioController />
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
        {/* Render the current page (Home or AlbumDetail) */}
        <main className={`flex-1 overflow-y-auto ${currentAlbum ? 'pb-[88px]' : ''}`}>
           <Outlet />
        </main>
      </div>

      {/* Player Overlay */}
      <PlayerBar />
    </div>
  );
};
