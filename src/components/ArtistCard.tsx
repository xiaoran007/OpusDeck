import { User } from 'lucide-react';

interface ArtistCardProps {
  id: string;
  name: string;
  albumCount?: number;
  onClick: () => void;
}

export const ArtistCard = ({ name, albumCount, onClick }: ArtistCardProps) => {
  return (
    <div 
        onClick={onClick}
        className="flex flex-col items-center p-4 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
    >
        <div className="w-32 h-32 rounded-full bg-neutral-800 flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition-transform overflow-hidden relative">
            {/* Placeholder for now, can be upgraded to real image later */}
            <User className="w-12 h-12 text-neutral-600" />
        </div>
        <h3 className="text-white font-medium text-center truncate w-full" title={name}>{name}</h3>
        {albumCount !== undefined && (
            <p className="text-xs text-neutral-500">{albumCount} Albums</p>
        )}
    </div>
  );
};
