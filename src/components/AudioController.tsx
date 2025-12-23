import { useEffect, useRef } from 'react';
import { usePlayerStore } from '../stores/usePlayerStore';
import { useAuthStore } from '../stores/useAuthStore';

export const AudioController = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { 
    currentSong, 
    isPlaying, 
    volume,
    seekRequest,
    next,
    prev,
    seek,
    setIsPlaying, 
    setCurrentTime, 
    setDuration,
    setIsLoading
  } = usePlayerStore();

  const { client } = useAuthStore();

  // Initialize Audio Object
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;

    // Event Listeners
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    
    // Only update store if difference is significant to avoid jitter during seek?
    // Actually, we should just update. But we must be careful not to create loop if we bind strictly.
    // Since UI range input is uncontrolled for 'value' when user is dragging (it holds internal state?),
    // No, React range input is controlled. 
    // To avoid fighting, we can throttle updates, but for now simple is fine.
    const onTimeUpdate = () => {
        if (!audio.paused) {
            setCurrentTime(audio.currentTime);
        }
    };
    
    const onDurationChange = () => setDuration(audio.duration);
    const onEnded = () => next();
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);
    const onError = (e: Event) => {
        console.error("Audio playback error:", e);
        setIsLoading(false);
        setIsPlaying(false);
    }

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('error', onError);
    };
  }, []);

  // Handle Seek Request
  useEffect(() => {
      if (seekRequest !== null && audioRef.current) {
          // Check if valid time
          if (isFinite(seekRequest)) {
              audioRef.current.currentTime = seekRequest;
          }
      }
  }, [seekRequest]);

  // Handle Song Change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !client) return;

    if (currentSong) {
      const streamUrl = client.getStreamUrl(currentSong.id);
      
      // Check if we need to change source
      // Note: Subsonic stream URLs might be identical for same ID, but maybe different if salt/token changes?
      // Usually token is in query param.
      // We can compare audio.src with new url.
      
      // Simple check: does the src contain the ID? (Subsonic uses ID in query param usually)
      // Let's just blindly update if currentSong.id changed.
      // But we don't have previous ID here easily without ref.
      
      // Better: Reset src always if song object ref changed.
      if (!audio.src.includes(`id=${currentSong.id}`)) {
          audio.src = streamUrl;
          audio.load();
          if (isPlaying) {
              const playPromise = audio.play();
              if (playPromise !== undefined) {
                  playPromise.catch(err => console.warn("Autoplay blocked:", err));
              }
          }
      }
    } else {
      audio.pause();
      audio.src = '';
    }
  }, [currentSong, client]);

  // Handle Play/Pause Toggle
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;

    if (isPlaying && audio.paused) {
      audio.play().catch(e => console.error("Play failed:", e));
    } else if (!isPlaying && !audio.paused) {
      audio.pause();
    }
  }, [isPlaying]);

  // Handle Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle Media Session API
  useEffect(() => {
    if (!currentSong || !client || !('mediaSession' in navigator)) return;

    // 1. Set Metadata
    // Navidrome allows fetching cover art by ID (can be song ID or album ID)
    // We construct sizes to ensure OS picks the best one
    const getIcon = (size: number) => ({
        src: client.getCoverArtUrl(currentSong.id, size),
        sizes: `${size}x${size}`,
        type: 'image/jpeg'
    });

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentSong.title,
      artist: currentSong.artist,
      album: currentSong.album,
      artwork: [
        getIcon(96),
        getIcon(128),
        getIcon(192),
        getIcon(256),
        getIcon(384),
        getIcon(512),
      ]
    });

    // 2. Set Action Handlers
    navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true));
    navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false));
    navigator.mediaSession.setActionHandler('previoustrack', () => prev());
    navigator.mediaSession.setActionHandler('nexttrack', () => next());
    
    navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) {
            seek(details.seekTime);
        }
    });

  }, [currentSong, client, next, prev, setIsPlaying, seek]);

  return null;
};