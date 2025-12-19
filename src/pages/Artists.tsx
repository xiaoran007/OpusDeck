import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { ArtistCard } from '../components/ArtistCard';

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
                    <ArtistCard 
                        key={artist.id}
                        id={artist.id}
                        name={artist.name}
                        albumCount={artist.albumCount}
                        onClick={() => navigate(`/artist/${artist.id}`)}
                    />
                ))}
            </div>
        </div>
    );
};

