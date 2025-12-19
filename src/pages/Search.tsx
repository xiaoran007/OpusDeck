import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { usePlayerStore } from '../stores/usePlayerStore';
import { Album, Song } from '../types';
import { AlbumCard } from '../components/AlbumCard';
import { ArtistCard } from '../components/ArtistCard';
import { TrackList } from '../components/TrackList';

interface SearchResult {
    artists: { id: string; name: string }[];
    albums: Album[];
    songs: Song[];
}

export const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const navigate = useNavigate();
    
    const { client, isAuthenticated } = useAuthStore();
    const { playAlbum } = usePlayerStore(); // Using playAlbum to play song lists

    const [results, setResults] = useState<SearchResult>({ artists: [], albums: [], songs: [] });
    const [loading, setLoading] = useState(false);
    const [searchedQuery, setSearchedQuery] = useState('');

    useEffect(() => {
        const performSearch = async () => {
            if (!client || !isAuthenticated || !query) return;
            
            setLoading(true);
            try {
                const res = await client.search3(query);
                const data = res.searchResult3 || {};

                // Process Artists
                const artists = (data.artist || []).map((a: any) => ({
                    id: a.id,
                    name: a.name
                }));

                // Process Albums
                const albums: Album[] = (data.album || []).map((item: any) => ({
                    id: item.id,
                    title: item.title || item.name,
                    artist: item.artist,
                    year: item.year,
                    genre: item.genre,
                    songCount: item.songCount || 0,
                    coverArt: client.getCoverArtUrl(item.id)
                }));

                // Process Songs
                const songs: Song[] = (data.song || []).map((s: any) => ({
                    id: s.id,
                    title: s.title,
                    artist: s.artist,
                    album: s.album,
                    duration: s.duration,
                    trackNumber: s.track,
                }));

                setResults({ artists, albums, songs });
                setSearchedQuery(query);

            } catch (err) {
                console.error("Search failed:", err);
            } finally {
                setLoading(false);
            }
        };

        performSearch();
    }, [query, client, isAuthenticated]);

    const handlePlaySong = (index: number) => {
        // When playing a song from search results, treating the results list as a temporary playlist
        if (results.songs.length > 0) {
             const dummyAlbum: Album = {
                id: `search-${query}`,
                title: `Search: ${query}`,
                artist: 'Various Artists',
                coverArt: '', 
                year: new Date().getFullYear(),
                songCount: results.songs.length
            };
            playAlbum(dummyAlbum, results.songs, index);
        }
    };

    if (!query) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-neutral-500">
                <p>Type something in the search bar to find music.</p>
            </div>
        );
    }

    if (loading) {
        return <div className="p-8 text-neutral-500">Searching for "{query}"...</div>;
    }

    const hasResults = results.artists.length > 0 || results.albums.length > 0 || results.songs.length > 0;

    if (!hasResults && searchedQuery) {
         return (
            <div className="flex flex-col items-center justify-center h-full text-neutral-500">
                <p>No results found for "{searchedQuery}".</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-[1920px] mx-auto pb-24">
            <h1 className="text-3xl font-bold text-white mb-8">Results for "{searchedQuery}"</h1>

            {/* Artists Section */}
            {results.artists.length > 0 && (
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Artists</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {results.artists.slice(0, 6).map(artist => (
                            <ArtistCard 
                                key={artist.id}
                                id={artist.id}
                                name={artist.name}
                                onClick={() => navigate(`/artist/${artist.id}`)}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Albums Section */}
            {results.albums.length > 0 && (
                <section className="mb-12">
                     <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Albums</h2>
                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                        {results.albums.slice(0, 10).map(album => (
                            <AlbumCard 
                                key={album.id}
                                album={album}
                                onClick={(a) => navigate(`/album/${a.id}`)}
                            />
                        ))}
                     </div>
                </section>
            )}

            {/* Songs Section */}
            {results.songs.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Songs</h2>
                    <TrackList 
                        songs={results.songs} 
                        onPlaySong={handlePlaySong} 
                        showAlbumColumn={true}
                    />
                </section>
            )}
        </div>
    );
};
