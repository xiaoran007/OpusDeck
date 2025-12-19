import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, ArrowLeft, Shuffle, ListMusic } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { usePlayerStore } from '../stores/usePlayerStore';
import { Song, Album } from '../types';
import { TrackList } from '../components/TrackList';

export const PlaylistDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { client, isAuthenticated } = useAuthStore();
  const { playAlbum } = usePlayerStore(); // reusing playAlbum for queue management

  const [playlistName, setPlaylistName] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!client || !isAuthenticated || !id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await client.getPlaylist(id);
        const pl = res.playlist;
        setPlaylistName(pl.name);
        
        const rawEntries = pl.entry || [];
        
        const songList: Song[] = rawEntries.map((s: any) => ({
          id: s.id,
          title: s.title,
          artist: s.artist,
          album: s.album,
          duration: s.duration,
          trackNumber: s.track,
          bitRate: s.bitRate,
          suffix: s.suffix,
          contentType: s.contentType,
          bitDepth: s.bitDepth,
          sampleRate: s.samplingRate
          // Playlist entries might have coverArt for the specific song
          // but our Song type doesn't stricly require it for playback (we fetch album art mostly)
        }));

        setSongs(songList);
      } catch (err) {
        console.error("Failed to load playlist:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, client, isAuthenticated]);

  const handlePlayAll = () => {
    if (songs.length > 0) {
      // Create a dummy album object for the player store context
      const dummyAlbum: Album = {
          id: `playlist-${id}`,
          title: playlistName,
          artist: 'Various Artists',
          coverArt: '', // Playlist cover logic is complex, skipping for now
          year: new Date().getFullYear(),
          songCount: songs.length
      };
      playAlbum(dummyAlbum, songs, 0);
    }
  };

  const handlePlaySong = (index: number) => {
      const dummyAlbum: Album = {
          id: `playlist-${id}`,
          title: playlistName,
          artist: 'Various Artists',
          coverArt: '',
          year: new Date().getFullYear(),
          songCount: songs.length
      };
      playAlbum(dummyAlbum, songs, index);
  };

  if (loading) return <div className="flex items-center justify-center h-full text-neutral-500">Loading playlist...</div>;

  return (
    <div className="min-h-full pb-10">
      <div className="sticky top-0 z-30 flex items-center px-8 py-4 bg-[#1e1e1e]/95 backdrop-blur-md border-b border-white/5">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/10 text-white transition-colors mr-4">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-semibold text-lg opacity-0">{playlistName}</span>
      </div>

      <div className="px-8 mt-4 max-w-[1920px] mx-auto">
        <div className="flex flex-col md:flex-row gap-8 mb-10 items-end">
          <div className="w-64 h-64 shadow-2xl rounded-lg overflow-hidden flex-shrink-0 bg-neutral-800 flex items-center justify-center">
             <ListMusic className="w-24 h-24 text-neutral-600" />
          </div>

          <div className="flex flex-col gap-3 pb-2 flex-1 min-w-0">
            <h4 className="text-sm font-medium text-accent uppercase tracking-wider">Playlist</h4>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">{playlistName}</h1>
            <p className="text-sm text-neutral-400 mt-1">{songs.length} Songs</p>

            <div className="flex items-center gap-4 mt-4">
              <button onClick={handlePlayAll} className="px-8 py-3 bg-accent hover:bg-red-600 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-lg active:scale-95">
                <Play className="w-5 h-5 fill-current" /> Play
              </button>
              <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors active:scale-95">
                <Shuffle className="w-5 h-5" /> Shuffle
              </button>
            </div>
          </div>
        </div>

        <div className="w-full">
            <TrackList songs={songs} onPlaySong={handlePlaySong} showAlbumColumn={true} />
        </div>
      </div>
    </div>
  );
};
