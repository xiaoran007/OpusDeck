import { Search, Home, Radio, LayoutGrid, Clock, Mic2, Disc, ListMusic } from 'lucide-react';

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-sidebar flex-shrink-0 flex flex-col h-full border-r border-white/5">
      {/* Search Area */}
      <div className="p-4 pt-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-[#1f1f1f] border border-transparent focus:border-white/10 text-sm text-white rounded-lg pl-9 pr-4 py-1.5 outline-none transition-colors placeholder:text-neutral-500"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 space-y-6 scrollbar-none">
        {/* Main Section */}
        <div className="space-y-1">
          <NavItem icon={Home} label="Home" />
          <NavItem icon={LayoutGrid} label="Browse" />
          <NavItem icon={Radio} label="Radio" />
        </div>

        {/* Library Section */}
        <div>
          <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Library</h3>
          <div className="space-y-1">
            <NavItem icon={Clock} label="Recently Added" active />
            <NavItem icon={Mic2} label="Artists" />
            <NavItem icon={Disc} label="Albums" />
            <NavItem icon={ListMusic} label="Songs" />
          </div>
        </div>

        {/* Playlists Section */}
        <div>
          <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Playlists</h3>
          <div className="space-y-1">
            <NavItem label="Classical Essentials" />
            <NavItem label="Baroque Favorites" />
            <NavItem label="Piano Concertos" />
          </div>
        </div>
      </nav>
    </aside>
  );
};

interface NavItemProps {
  icon?: React.ElementType;
  label: string;
  active?: boolean;
}

const NavItem = ({ icon: Icon, label, active }: NavItemProps) => {
  return (
    <button 
      className={`
        w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
        ${active 
          ? 'bg-white/10 text-white' 
          : 'text-neutral-400 hover:text-white hover:bg-white/5'
        }
      `}
    >
      {Icon && <Icon className={`w-5 h-5 ${active ? 'text-accent' : 'text-current'}`} />}
      <span className="truncate">{label}</span>
    </button>
  );
};
