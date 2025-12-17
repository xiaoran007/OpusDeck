import md5 from 'md5';

export interface SubsonicCredentials {
  url: string;
  username: string;
  password?: string; // Only needed once to generate token/salt, then optional if we store token
}

export interface SubsonicResponse<T> {
  "subsonic-response": {
    status: 'ok' | 'failed';
    version: string;
    error?: {
      code: number;
      message: string;
    };
  } & T;
}

export class SubsonicClient {
  private url: string;
  private username: string;
  private salt: string;
  private token: string;
  private version = '1.16.1';
  private clientName = 'OpusDeck';

  constructor(creds: SubsonicCredentials) {
    // Ensure URL doesn't have trailing slash
    this.url = creds.url.replace(/\/$/, '');
    this.username = creds.username;
    
    // Generate Salt (random string)
    this.salt = Math.random().toString(36).substring(2, 15);
    // Generate Token = MD5(password + salt)
    this.token = md5((creds.password || '') + this.salt);
  }

  // Helper to build query params
  private getQueryParams() {
    return new URLSearchParams({
      u: this.username,
      t: this.token,
      s: this.salt,
      v: this.version,
      c: this.clientName,
      f: 'json'
    });
  }

  // Build a full URL for a specific endpoint
  public buildUrl(endpoint: string, params: Record<string, string | number> = {}): string {
    const query = this.getQueryParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) query.append(key, String(value));
    });
    return `${this.url}/rest/${endpoint}?${query.toString()}`;
  }

  // Generic request method
  private async request<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
    const fullUrl = this.buildUrl(endpoint, params);
    
    try {
      const res = await fetch(fullUrl);
      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }
      const data = await res.json() as SubsonicResponse<T>;
      
      if (data['subsonic-response'].status === 'failed') {
        const err = data['subsonic-response'].error;
        throw new Error(`Subsonic API Error ${err?.code}: ${err?.message}`);
      }
      
      return data['subsonic-response'] as T;
    } catch (error) {
      console.error(`Request to ${endpoint} failed:`, error);
      throw error;
    }
  }

  // --- API Methods ---

  public async ping() {
    return this.request<{}>('ping');
  }

  public async getAlbumList(type: 'newest' | 'random' | 'frequent' | 'recent' = 'newest', size = 20) {
    return this.request<{ albumList: { album: any[] } }>('getAlbumList', { type, size });
  }
  
  public async getAlbum(id: string) {
    return this.request<{ album: any }>('getAlbum', { id });
  }

  // Helper to get image URL directly (for <img src />)
  public getCoverArtUrl(id: string, size = 600) {
    return this.buildUrl('getCoverArt', { id, size });
  }

  // Helper to get stream URL directly (for <audio src />)
  public getStreamUrl(id: string) {
    return this.buildUrl('stream', { id });
  }
}
