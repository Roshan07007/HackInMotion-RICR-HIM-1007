# HackInMotion: AI Career Assistant & Job Platform

A full-stack, cross-platform AI Career Assistant platform built to help tech professionals land their dream jobs. The platform features an intelligent Resume Analyzer, an AI-powered Career Mentor, and a dynamic Job Feed with personalized recommendations.

## 🚀 Overview

This repository is structured as a monorepo containing three main applications:

- **client**: A responsive React Web Application built with Tailwind CSS.
- **mobile**: A cross-platform React Native Mobile App built with Expo and NativeWind.
- **server**: A Node.js / Express Backend powering the AI and business logic, backed by MongoDB.

## ✨ Key Features

- **Deep Resume Analysis**: Upload a PDF resume and get an instant ATS readiness score, skills gap analysis, and tailored bullet point improvements via AI.
- **AI Career Mentor**: A conversational chat interface to get personalized interview prep, career advice, and resume reviews based on your target role.
- **Smart Job Feed**: Browse, filter, and save jobs tailored to your skills and preferences.
- **Cross-Platform Syncing**: Your profile, saved jobs, and chat history sync perfectly across the web and mobile apps.

## 🛠 Tech Stack

- **Frontend**: React, Tailwind CSS, Zustand, React Router
- **Mobile**: React Native, Expo, NativeWind (Tailwind), Zustand
- **Backend**: Node.js, Express, MongoDB (Mongoose), Cloudinary (File Storage)
- **AI Integration**: Groq SDK (LLaMA 3 70B & 8B models)

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or a Mongo URI)
- Groq API Key
- Cloudinary Account (for resume PDF storage)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd HackInMotion-RICR-HIM-1007
   ```

2. **Setup Server:**
   Navigate to the `server` directory, install dependencies, configure the `.env` file, and start the development server. (See `server/README.md` for details).

3. **Setup Web Client:**
   Navigate to the `client` directory, install dependencies, configure the `.env` file, and run the React app. (See `client/README.md` for details).

4. **Setup Mobile App:**
   Navigate to the `mobile` directory, install dependencies, configure the `.env` file, and start Expo. (See `mobile/README.md` for details).

---
*Built with ❤️ for the HackInMotion Hackathon.*
