import { useEffect, useState } from 'react';
import { Home, Grid, Music, User, Search, ListMusic } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

interface NavItemProps {
  icon: any;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon: Icon, label, active = false, onClick }: NavItemProps) => (
  <div 
    onClick={onClick}
    className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer transition-colors select-none ${active ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
  >
    <Icon size={20} />
    <span className="text-sm font-medium truncate">{label}</span>
  </div>
);

const SectionHeader = ({ title }: { title: string }) => (
  <h3 className="px-3 mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider mt-6">{title}</h3>
);

interface Playlist {
    id: string;
    name: string;
}

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { client, isAuthenticated, username } = useAuthStore();
  
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [searchValue, setSearchValue] = useState('');

  // Clear search input when navigating away from search results
  useEffect(() => {
      if (!location.pathname.startsWith('/search')) {
          setSearchValue('');
      }
  }, [location.pathname]);

  useEffect(() => {
    const fetchPlaylists = async () => {
        if (!client || !isAuthenticated) return;
        try {
            const res = await client.getPlaylists();
            const list = res.playlists?.playlist || [];
            setPlaylists(list);
        } catch (e) {
            console.error("Failed to fetch playlists", e);
        }
    };
    fetchPlaylists();
  }, [client, isAuthenticated]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && searchValue.trim()) {
          navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      }
  };

  const currentPath = location.pathname;

  return (
    <div className="w-64 bg-app-sidebar flex-shrink-0 flex flex-col h-full border-r border-app-divider pt-4">
      <div className="px-5 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-neutral-500" size={16} />
          <input 
            type="text" 
            placeholder="Search" 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full bg-[#262626] text-white text-sm pl-9 pr-3 py-2 rounded-lg border-none focus:ring-1 focus:ring-accent outline-none placeholder-neutral-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <NavItem 
            icon={Home} 
            label="Home" 
            active={currentPath === '/'} 
            onClick={() => navigate('/')}
        />
        
        {/* Placeholder for future features */}
        {/* <NavItem icon={Grid} label="Browse" /> */}
        {/* <NavItem icon={ListMusic} label="Radio" /> */}

        <SectionHeader title="Library" />
        <NavItem 
            icon={Music} 
            label="Recently Added" 
            active={currentPath === '/library/recent'} 
            onClick={() => navigate('/library/recent')}
        />
        
        <NavItem 
            icon={User} 
            label="Artists" 
            onClick={() => navigate('/library/artists')}
            active={currentPath === '/library/artists'}
        /> 
        <NavItem 
            icon={Grid} 
            label="Albums" 
            onClick={() => navigate('/library/albums')}
            active={currentPath === '/library/albums'}
        />
        
        <SectionHeader title="Playlists" />
        {playlists.length === 0 ? (
            <div className="px-3 py-2 text-xs text-neutral-600 italic">
                {isAuthenticated ? 'No playlists found' : 'Login to see playlists'}
            </div>
        ) : (
            playlists.map(pl => (
                <NavItem 
                    key={pl.id}
                    icon={ListMusic}
                    label={pl.name}
                    onClick={() => navigate(`/playlist/${pl.id}`)}
                    active={currentPath === `/playlist/${pl.id}`}
                />
            ))
        )}
      </div>

      {/* User Profile Section */}
      {isAuthenticated && (
        <div className="px-3 py-4 border-t border-white/5 mt-auto bg-app-sidebar z-10">
            <div 
                onClick={() => navigate('/settings')}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors group ${currentPath === '/settings' ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800 border border-white/5 flex items-center justify-center text-sm font-bold text-white shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                    {username ? username.charAt(0).toUpperCase() : <User size={16}/>}
                </div>
                <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium text-white truncate">{username || 'User'}</span>
                    <span className="text-[10px] text-neutral-500 truncate flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"/>
                        Account Settings
                    </span>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
