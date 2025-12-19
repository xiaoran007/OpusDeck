export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // seconds
  trackNumber: number;
  
  // Audio Quality Metadata
  bitRate?: number; // kbps
  suffix?: string; // mp3, flac, m4a
  contentType?: string; // audio/flac
  
  // Extended Metadata (might not be available on all servers)
  bitDepth?: number; // 16, 24
  sampleRate?: number; // 44100, 48000, 96000
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverArt?: string; // URL or placeholder color
  year?: number;
  genre?: string;
  songCount: number;
  songs?: Song[];
}
