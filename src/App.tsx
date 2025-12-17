import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { HomePage } from './pages/Home';
import { RecentlyAddedPage } from './pages/RecentlyAdded';
import { AlbumDetailPage } from './pages/AlbumDetail';
import { useAuthStore } from './stores/useAuthStore';

// Simple placeholder for WIP pages
const WorkInProgress = ({ title }: { title: string }) => (
    <div className="flex items-center justify-center h-full text-neutral-500 text-lg">
        {title} - Coming Soon
    </div>
);

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          
          <Route path="library/recent" element={<RecentlyAddedPage />} />
          <Route path="library/artists" element={<WorkInProgress title="Artists" />} />
          <Route path="library/albums" element={<WorkInProgress title="All Albums" />} />
          
          <Route path="album/:id" element={<AlbumDetailPage />} />
          <Route path="playlist/:id" element={<WorkInProgress title="Playlist Detail" />} />
          
          {/* Catch all redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;