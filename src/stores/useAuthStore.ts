import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SubsonicClient } from '../api/subsonic';

interface AuthState {
  url: string;
  username: string;
  password?: string; // Note: Storing password in plain text in localStorage is not ideal for prod, but standard for self-hosted apps without backend proxy auth.
  isAuthenticated: boolean;
  client: SubsonicClient | null;
  
  login: (url: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => void; // Call on app start to recreate client from persisted data
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      url: '',
      username: '',
      password: '',
      isAuthenticated: false,
      client: null,

      login: async (url, username, password) => {
        try {
          // 1. Create temporary client
          const tempClient = new SubsonicClient({ url, username, password });
          
          // 2. Test connection
          await tempClient.ping();

          // 3. If success, save state
          set({ 
            url, 
            username, 
            password, 
            isAuthenticated: true,
            client: tempClient 
          });
        } catch (error) {
          console.error("Login failed:", error);
          throw error;
        }
      },

      logout: () => {
        set({ 
          url: '', 
          username: '', 
          password: '', 
          isAuthenticated: false, 
          client: null 
        });
      },

      initialize: () => {
        const { url, username, password, isAuthenticated } = get();
        if (isAuthenticated && url && username && password) {
          const client = new SubsonicClient({ url, username, password });
          set({ client });
        }
      }
    }),
    {
      name: 'opus-deck-auth', // localStorage key
      partialize: (state) => ({ // Only persist credentials
        url: state.url,
        username: state.username,
        password: state.password,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);
