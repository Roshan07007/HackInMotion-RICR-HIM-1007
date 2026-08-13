# Web Client | AI Career Assistant

The responsive React web application for the AI Career Assistant platform. This client offers a premium, modern UI with seamless interactions for uploading resumes, chatting with the AI mentor, and browsing jobs.

## 🚀 Features

- **Resume Analyzer Dashboard**: Interactive, animated dashboard displaying ATS scores, skill gaps, and bullet point recommendations.
- **AI Chat Interface**: Real-time conversational UI for the AI Career Mentor.
- **Job Board**: Filterable and paginated job board with "save job" functionality.
- **Dynamic UI**: Built with Tailwind CSS and DaisyUI, featuring light/dark mode support and smooth Lottie animations.

## 🛠 Tech Stack

- React (Vite)
- Tailwind CSS & DaisyUI
- Zustand (State Management)
- React Router DOM
- Axios
- Lucide React & Lottie React (Icons & Animations)

## 📦 Getting Started

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Environment Variables
Create a `.env` file in the root of the `client` directory:
```env
VITE_API_URL=http://localhost:5001/api/v1
```

### 3. Start the Development Server
```bash
npm run dev
```
The web app will be available at `http://localhost:5173`.
