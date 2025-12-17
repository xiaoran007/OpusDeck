import React from 'react';
import { Home, Grid, Music, User, Search, ListMusic } from 'lucide-react';

const NavItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <div className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${active ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}>
    <Icon size={20} />
    <span className="text-sm font-medium">{label}</span>
  </div>
);

const SectionHeader = ({ title }: { title: string }) => (
  <h3 className="px-3 mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider mt-6">{title}</h3>
);

export const Sidebar = () => {
  return (
    <div className="w-64 bg-app-sidebar flex flex-col h-full border-r border-app-divider pt-4 pb-20">
      <div className="px-5 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-neutral-500" size={16} />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-[#262626] text-white text-sm pl-9 pr-3 py-2 rounded-lg border-none focus:ring-1 focus:ring-accent outline-none placeholder-neutral-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <NavItem icon={Home} label="Home" />
        <NavItem icon={Grid} label="Browse" />
        <NavItem icon={ListMusic} label="Radio" />

        <SectionHeader title="Library" />
        <NavItem icon={Music} label="Recently Added" active />
        <NavItem icon={User} label="Artists" />
        <NavItem icon={Grid} label="Albums" />
        <NavItem icon={Music} label="Songs" />

        <SectionHeader title="Playlists" />
        <NavItem icon={ListMusic} label="Classical Essentials" />
        <NavItem icon={ListMusic} label="Late Night Piano" />
        <NavItem icon={ListMusic} label="Focus" />
      </div>
    </div>
  );
};
