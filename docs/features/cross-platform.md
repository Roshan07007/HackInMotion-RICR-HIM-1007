# Cross-Platform Architecture

HireMe is built with a modern, cross-platform architecture designed to reach users wherever they are.

## Frontend (Web)
- **Framework:** React + Vite
- **Styling:** TailwindCSS
- **Description:** Provides a rich, responsive experience for desktop and mobile web users. The web application allows users to comfortably manage their profiles, upload documents, and view detailed analytical reports on a larger screen.

## Mobile Application
- **Framework:** React Native + Expo
- **Description:** A native mobile experience for both iOS and Android. This allows for push notifications, camera/microphone access for on-the-go mock interviews, and a seamless native UX.

## Shared Backend
- **Framework:** Node.js + Express
- **Database:** MongoDB
- **Description:** A single, unified REST API serves both the Web and Mobile clients, ensuring that data (saved jobs, interview history, chat transcripts) is instantly synchronized across all platforms.
