# OpusDeck

OpusDeck is a modern, high-fidelity web client for [Navidrome](https://www.navidrome.org/) and other Subsonic-compatible music servers.

Inspired by the clean aesthetics of Apple Music, OpusDeck provides a premium listening experience for your self-hosted library, featuring a glassmorphism UI, gapless-style playback, and deep metadata visualization.

> **Note**: This project is currently in early development (v0.2.0).

![OpusDeck Screenshot](https://files.catbox.moe/s8bzu1.png)

## ✨ Features

- **High-Fidelity UI**: Dark mode design with blur effects and smooth transitions.
- **Detailed Metadata**: Visual badges for **Hi-Res**, **Lossless**, and bit-perfect audio details.
- **Smart Library**:
  - **Home**: Personalized dashboard with "New Releases" and "Discover".
  - **Queue Management**: Full control over your "Up Next" list.
  - **Global Search**: Instantly find Artists, Albums, and Songs.
  - **Playlists**: Full support for server-side playlists.
- **Universal Access**: Works with Navidrome, Gonic, Airsonic-Advanced, etc.

## 🚀 Getting Started

The easiest way to run OpusDeck is using Docker.

### Quick Start (Docker Compose)

1.  Save the following as `docker-compose.yml`:

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
          # Essential for OpusDeck connection
          ND_CORS_ENABLED: "true" 
          ND_CORS_ALLOWORIGINS: "*" 
        volumes:
          - "./data/navidrome:/data"
          - "./music:/music:ro"
        restart: unless-stopped

      opus-deck:
        image: xiaoran007/opusdeck:latest
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

3.  Open **`http://localhost:8080`** and log in with your Navidrome credentials.

## 🤖 AI Disclaimer

This project was built with the assistance of Large Language Models (LLMs).
While the code has been reviewed and tested, it represents an exploration of AI-assisted software engineering.

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome! Feel free to open an issue or submit a PR.

## 📄 License

GPLv3
