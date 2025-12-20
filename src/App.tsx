import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { HomePage } from './pages/Home';
import { RecentlyAddedPage } from './pages/RecentlyAdded';
import { AlbumDetailPage } from './pages/AlbumDetail';
import { ArtistsPage } from './pages/Artists';
import { ArtistDetailPage } from './pages/ArtistDetail';
import { AlbumsPage } from './pages/Albums';
import { PlaylistDetailPage } from './pages/PlaylistDetail';
import { SearchPage } from './pages/Search';
import Settings from './pages/Settings';
import { useAuthStore } from './stores/useAuthStore';

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
          
          <Route path="search" element={<SearchPage />} />
          <Route path="settings" element={<Settings />} />
          
          <Route path="library/recent" element={<RecentlyAddedPage />} />
          <Route path="library/artists" element={<ArtistsPage />} />
          <Route path="artist/:id" element={<ArtistDetailPage />} />
          <Route path="library/albums" element={<AlbumsPage />} />
          
          <Route path="album/:id" element={<AlbumDetailPage />} />
          <Route path="playlist/:id" element={<PlaylistDetailPage />} />
          
          {/* Catch all redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;