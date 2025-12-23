import { useAuthStore } from '../stores/useAuthStore';
import { Server, LogOut, User, ShieldCheck, Info, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { url, username, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm('Are you sure you want to disconnect?')) {
      logout();
      navigate('/');
    }
  };

  // Helper to extract domain for cleaner display
  const getServerDomain = (fullUrl: string) => {
    try {
      return new URL(fullUrl).hostname;
    } catch {
      return fullUrl;
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="pb-6 border-b border-white/10">
        <h1 className="text-3xl font-bold text-white">Account Settings</h1>
      </header>

      {/* Profile Card */}
      <section className="bg-[#1e1e1e]/50 border border-white/5 rounded-2xl p-6 flex items-start gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
          {username?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 space-y-1">
            <h2 className="text-2xl font-bold text-white">{username}</h2>
            <div className="flex items-center gap-2 text-neutral-400">
                <ShieldCheck size={14} className="text-green-500" />
                <span className="text-sm">Authenticated User</span>
            </div>
        </div>
      </section>

      {/* Connection Details */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-white/90 px-1">Connection</h3>
        <div className="bg-[#1e1e1e]/50 border border-white/5 rounded-xl overflow-hidden divide-y divide-white/5">
            <div className="p-4 flex items-center justify-between group hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Server size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">Server URL</p>
                        <p className="text-xs text-neutral-400">{url}</p>
                    </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20">
                    CONNECTED
                </div>
            </div>
            
            <div className="p-4 flex items-center justify-between group hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <User size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">Username</p>
                        <p className="text-xs text-neutral-400">{username}</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* App Info */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-white/90 px-1">Application</h3>
        <div className="bg-[#1e1e1e]/50 border border-white/5 rounded-xl overflow-hidden">
            <div 
                onClick={() => navigate('/about')}
                className="p-4 flex items-center justify-between group hover:bg-white/5 transition-colors cursor-pointer"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-neutral-700/50 flex items-center justify-center text-neutral-400">
                        <Info size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">About OpusDeck</p>
                        <p className="text-xs text-neutral-400">Version, License, and Credits</p>
                    </div>
                </div>
                <ChevronRight size={16} className="text-neutral-600 group-hover:text-white transition-colors" />
            </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="pt-4">
        <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors font-medium"
        >
            <LogOut size={18} />
            Disconnect from Server
        </button>
        <p className="text-center text-xs text-neutral-500 mt-4">
            OpusDeck v0.3.0 • Connected to {getServerDomain(url || '')}
        </p>
      </section>
    </div>
  );
};

export default Settings;
