export interface Album {
  id: string;
  title: string;
  artist: string;
  year: number;
  coverUrl: string;
}

export const albums: Album[] = [
  {
    id: '1',
    title: 'Beethoven: Symphony No. 9',
    artist: 'Berlin Philharmonic & Karajan',
    year: 1963,
    coverUrl: 'https://picsum.photos/seed/beethoven9/400/400',
  },
  {
    id: '2',
    title: 'Bach: Goldberg Variations',
    artist: 'Glenn Gould',
    year: 1981,
    coverUrl: 'https://picsum.photos/seed/bachgoldberg/400/400',
  },
  {
    id: '3',
    title: 'Mozart: Requiem',
    artist: 'Karl Böhm',
    year: 1971,
    coverUrl: 'https://picsum.photos/seed/mozartreq/400/400',
  },
  {
    id: '4',
    title: 'Mahler: Symphony No. 2 "Resurrection"',
    artist: 'Leonard Bernstein',
    year: 1987,
    coverUrl: 'https://picsum.photos/seed/mahler2/400/400',
  },
  {
    id: '5',
    title: 'Tchaikovsky: Swan Lake',
    artist: 'London Symphony Orchestra',
    year: 1978,
    coverUrl: 'https://picsum.photos/seed/swanlake/400/400',
  },
  {
    id: '6',
    title: 'Vivaldi: The Four Seasons',
    artist: 'Itzhak Perlman',
    year: 1976,
    coverUrl: 'https://picsum.photos/seed/vivaldi/400/400',
  },
  {
    id: '7',
    title: 'Chopin: Nocturnes',
    artist: 'Arthur Rubinstein',
    year: 1965,
    coverUrl: 'https://picsum.photos/seed/chopin/400/400',
  },
  {
    id: '8',
    title: 'Stravinsky: The Rite of Spring',
    artist: 'Pierre Boulez',
    year: 1969,
    coverUrl: 'https://picsum.photos/seed/rite/400/400',
  },
  {
    id: '9',
    title: 'Rachmaninoff: Piano Concerto No. 2',
    artist: 'Sviatoslav Richter',
    year: 1959,
    coverUrl: 'https://picsum.photos/seed/rach2/400/400',
  },
  {
    id: '10',
    title: 'Wagner: Der Ring des Nibelungen',
    artist: 'Georg Solti',
    year: 1958,
    coverUrl: 'https://picsum.photos/seed/ring/400/400',
  },
   {
    id: '11',
    title: 'Debussy: La Mer',
    artist: 'Claudio Abbado',
    year: 2002,
    coverUrl: 'https://picsum.photos/seed/debussy/400/400',
  },
  {
    id: '12',
    title: 'Brahms: Ein deutsches Requiem',
    artist: 'Otto Klemperer',
    year: 1961,
    coverUrl: 'https://picsum.photos/seed/brahms/400/400',
  },
];
