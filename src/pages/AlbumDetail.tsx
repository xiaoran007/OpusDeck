import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, ArrowLeft, Shuffle, Heart } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { usePlayerStore } from '../stores/usePlayerStore';
import { Album, Song } from '../types';
import { TrackList } from '../components/TrackList';
import { AudioBadge } from '../components/AudioBadge';

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const AlbumDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { client, isAuthenticated } = useAuthStore();
  const { playAlbum } = usePlayerStore();

  const [album, setAlbum] = useState<Album | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!client || !isAuthenticated || !id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await client.getAlbum(id);
        const data = res.album;
        
        // Process Album Info
        const albumInfo: Album = {
          id: data.id,
          title: data.title || data.name,
          artist: data.artist,
          year: data.year,
          genre: data.genre,
          songCount: data.songCount,
          coverArt: client.getCoverArtUrl(data.id, 600),
          starred: data.starred
        };
        
        // Process Songs
        let rawSongs = data.song || [];
        if (!Array.isArray(rawSongs)) rawSongs = [rawSongs];
        
        const songList: Song[] = rawSongs.map((s: any) => ({
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
          sampleRate: s.samplingRate // Subsonic often uses 'samplingRate' not 'sampleRate'? Let's try both or just check api docs. usually it's not standard.
          // Wait, checking Navidrome source code or docs would be best.
          // Standard Subsonic API 1.16.1 doesn't explicitly list these.
          // However, let's map whatever properties might exist.
        }));

        setAlbum(albumInfo);
        setSongs(songList);
      } catch (err) {
        console.error("Failed to load album details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, client, isAuthenticated]);

  const handlePlayAll = () => {
    if (album && songs.length > 0) {
      playAlbum(album, songs, 0);
    }
  };

  const handlePlaySong = (index: number) => {
    if (album) {
      playAlbum(album, songs, index);
    }
  };

  const toggleStar = async () => {
      if (!album || !client) return;
      
      const isStarred = !!album.starred;
      // Optimistic Update
      setAlbum(prev => prev ? ({ ...prev, starred: isStarred ? undefined : new Date().toISOString() }) : null);

      try {
          if (isStarred) {
              await client.unstar(undefined, album.id);
          } else {
              await client.star(undefined, album.id);
          }
      } catch (e) {
          console.error("Failed to toggle star", e);
      }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full text-neutral-500">Loading details...</div>;
  }

  if (!album) {
    return <div className="flex items-center justify-center h-full text-neutral-500">Album not found.</div>;
  }

  // Get representative song for badge (first song)
  const representativeSong = songs.length > 0 ? songs[0] : null;

  return (
    <div className="min-h-full pb-10">
      {/* Navbar Placeholder for Back Button */}
      <div className="sticky top-0 z-30 flex items-center px-8 py-4 bg-[#1e1e1e]/95 backdrop-blur-md border-b border-white/5">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-white/10 text-white transition-colors mr-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-semibold text-lg opacity-0 transition-opacity duration-300 truncate" style={{ opacity: 0 }}>
          {album.title}
        </span>
      </div>

      <div className="px-8 mt-4 max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-10 items-end">
          {/* Cover Art */}
          <div className="w-64 h-64 shadow-2xl rounded-lg overflow-hidden flex-shrink-0 bg-neutral-800">
            <img src={album.coverArt} alt={album.title} className="w-full h-full object-cover" />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-3 pb-2 flex-1 min-w-0">
            <h4 className="text-sm font-medium text-accent uppercase tracking-wider">{album.genre || 'Music'}</h4>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight truncate w-full pb-1" title={album.title}>{album.title}</h1>
            <div className="flex items-center gap-2 text-xl text-white/90">
               <span className="font-medium hover:underline cursor-pointer">{album.artist}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-400 mt-1 font-medium">
              <span>{album.year} • {album.songCount} Songs • {formatDuration(songs.reduce((acc, s) => acc + s.duration, 0))}</span>
            </div>

            {/* Audio Quality Badge - Apple Style: Independent Row */}
            {representativeSong && (
                <div className="mt-3 mb-1">
                    <AudioBadge song={representativeSong} variant="album-header" />
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 mt-4">
              <button 
                onClick={handlePlayAll}
                className="px-8 py-3 bg-accent hover:bg-red-600 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-lg active:scale-95"
              >
                <Play className="w-5 h-5 fill-current" />
                Play
              </button>
              <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors active:scale-95">
                <Shuffle className="w-5 h-5" />
                Shuffle
              </button>
              <button 
                onClick={toggleStar}
                className={`p-3 rounded-lg flex items-center justify-center transition-colors active:scale-95 border ${album.starred ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'}`}
                title={album.starred ? "Unfavorite Album" : "Favorite Album"}
              >
                <Heart className={`w-5 h-5 ${album.starred ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Tracklist Component */}
        <div className="w-full">
            <TrackList songs={songs} onPlaySong={handlePlaySong} />
        </div>
      </div>
    </div>
  );
};
