# OpusDeck

OpusDeck is a modern, high-fidelity web client for [Navidrome](https://www.navidrome.org/) (and other Subsonic-compatible servers). Inspired by the aesthetics of Apple Music, it aims to provide a premium listening experience for your self-hosted music library.

## ✨ Features

- **Modern UI/UX**: Glassmorphism effects, smooth transitions, and a clean dark mode design.
- **Subsonic API Support**: Works with Navidrome, Gonic, Airsonic, etc.
- **Library Management**:
  - **Home**: Personalized dashboard with "New Releases" and "Discover".
  - **Recently Added**: Browse your latest additions.
  - **Artists & Albums**: Complete library indexing with detail views.
  - **Playlists**: Full support for viewing and playing server-side playlists.
- **Advanced Playback**:
  - Gapless-style audio control.
  - Queue management (internal).
  - Background audio support.
- **Tech Stack**:
  - **Framework**: React 18 + TypeScript + Vite
  - **Styling**: Tailwind CSS
  - **State Management**: Zustand (with persistence for auth)
  - **Routing**: React Router DOM v6
  - **Icons**: Lucide React

## 🚀 Deployment (Docker Compose)

The easiest way to run OpusDeck is using Docker Compose. This will start both a Navidrome server and the OpusDeck frontend.

1.  Create a `docker-compose.yml` file (or use the one in this repo):
    ```yaml
    version: "3"
    services:
      navidrome:
        image: deluan/navidrome:latest
        ports:
          - "4533:4533"
        environment:
          ND_SCANSCHEDULE: 1m
          ND_SESSIONTIMEOUT: 24h
          ND_BASEURL: ""
          # Enable CORS for OpusDeck
          ND_CORS_ENABLED: "true" 
          ND_CORS_ALLOWORIGINS: "*" 
        volumes:
          - "./data/navidrome:/data"
          - "./music:/music:ro"
        restart: unless-stopped

      opus-deck:
        image: xiaoran007/opus-deck:latest
        ports:
          - "8080:80"
        restart: unless-stopped
        depends_on:
          - navidrome
    ```

2.  Run the stack:
    ```bash
    docker-compose up -d
    ```

3.  Access OpusDeck at `http://localhost:8080`.
    - **Note**: When logging in, enter your Navidrome URL. If running locally with the setup above, use `http://localhost:4533` (or your LAN IP if accessing from another device).

## 🛠 Development

### Prerequisites

1.  **Node.js**: v18 or higher.
2.  **Navidrome Server**: A running instance.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/xiaoran007/opus-deck.git
    cd opus-deck
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

## 🤝 Contributing

This is an early MVP. Contributions, bug reports, and feature requests are welcome!

## 📄 License

GPL v3
