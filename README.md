# HireMe (HackInMotion)

HireMe is a comprehensive job search and career development platform. It features job browsing, saving, applications, AI-powered mock interviews, resume feedback, and a career mentor chat. The project consists of a React frontend, an Expo/React Native mobile app, and a Node.js/Express backend.

## Project Information

- **Frontend:** React (Vite), TailwindCSS
- **Mobile:** React Native (Expo)
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Features:**
  - Job Feed with debounced search and filtering
  - Document viewer for PDFs
  - AI Mock Interviews (Video/Audio)
  - Career Mentor Chat
  - Resume Analysis

## Setup Instructions

*Note: This section follows Section 8 of the General Instructions.*

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or remote URI)

### Backend Setup
1. Navigate to the `server` directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GROQ_API_KEY=your_groq_api_key
   ```
4. Start the development server: `npm run dev`

### Frontend Setup
1. Navigate to the `client` directory: `cd client`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`

### Mobile Setup
1. Navigate to the `mobile` directory: `cd mobile`
2. Install dependencies: `npm install`
3. Start Expo: `npm run android` or `npm run ios`

## Third-Party AI/NLP Service

**Service Used:** Groq Cloud API (`groq-sdk`)

**Why it was selected:**
Groq provides ultra-fast inference for large language models like LLaMA-3. Given the real-time nature of our AI Mock Interviews and Mentor Chat features, low latency is critical to providing a seamless, conversational user experience. Groq's specialized LPU hardware delivers the quickest time-to-first-token compared to other providers, making it ideal for our use case.

**How it is integrated:**
The Groq API is integrated entirely on the backend to keep API keys secure. We use the official `groq-sdk` Node.js package in our `ai.service.ts` to power:
- **Resume Analysis:** Parsing text and providing a match score/feedback against job descriptions.
- **Career Mentor Chat:** maintaining a conversational context and returning helpful advice.
- **Mock Interviews:** generating tailored interview questions and evaluating candidate responses in real-time.
