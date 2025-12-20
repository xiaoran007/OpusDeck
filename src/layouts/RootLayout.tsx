import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { PlayerBar } from '../components/PlayerBar';
import { LoginModal } from '../components/LoginModal';
import { AudioController } from '../components/AudioController';
import { QueueDrawer } from '../components/QueueDrawer';

export const RootLayout = () => {
  return (
    <div className="flex h-screen bg-app-bg text-white font-sans overflow-hidden selection:bg-accent/30 selection:text-white">
      <LoginModal />
      <AudioController />
      <QueueDrawer />
      
      {/* Sidebar - Now Full Height */}
      <Sidebar />

      {/* Main Content Area - Contains Page Content + PlayerBar */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e] relative">
        {/* Render the current page (Home or AlbumDetail) */}
        <main className="flex-1 overflow-y-auto scroll-smooth">
           <Outlet />
        </main>
        
        {/* Player Bar - Sticky at bottom of this column */}
        <PlayerBar />
      </div>
    </div>
  );
};