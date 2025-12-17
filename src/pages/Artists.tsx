import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';

interface Artist {
    id: string;
    name: string;
    albumCount?: number;
}

export const ArtistsPage = () => {
    const { client, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtists = async () => {
            if (!client || !isAuthenticated) return;
            setLoading(true);
            try {
                const res = await client.getArtists();
                // Flatten the index structure
                const indexes = res.artists?.index || [];
                let allArtists: Artist[] = [];
                
                indexes.forEach(idx => {
                    if (idx.artist) {
                        allArtists = [...allArtists, ...idx.artist];
                    }
                });
                
                setArtists(allArtists);
            } catch (e) {
                console.error("Failed to load artists", e);
            } finally {
                setLoading(false);
            }
        };
        fetchArtists();
    }, [client, isAuthenticated]);

    if (loading) return <div className="p-8 text-neutral-500">Loading artists...</div>;

    return (
        <div className="p-8 max-w-[1920px] mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">Artists</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {artists.map(artist => (
                    <div 
                        key={artist.id} 
                        onClick={() => navigate(`/artist/${artist.id}`)}
                        className="flex flex-col items-center p-4 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                        <div className="w-32 h-32 rounded-full bg-neutral-800 flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
                            {/* Subsonic doesn't always provide easy artist images in the list. Using placeholder or maybe fetch avatar later */}
                            <User className="w-12 h-12 text-neutral-600" />
                        </div>
                        <h3 className="text-white font-medium text-center truncate w-full">{artist.name}</h3>
                        {artist.albumCount !== undefined && (
                            <p className="text-xs text-neutral-500">{artist.albumCount} Albums</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
