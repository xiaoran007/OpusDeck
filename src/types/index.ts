export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // seconds
  trackNumber: number;
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
