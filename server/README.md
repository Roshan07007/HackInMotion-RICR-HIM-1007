# Server | AI Career Assistant

The backend API for the AI Career Assistant platform. Built with Node.js, Express, and MongoDB, this service handles user authentication, file uploads, job data, and the core AI logic for resume analysis and career mentoring.

## 🚀 Features

- **Authentication**: JWT-based secure authentication.
- **AI Integration**: Groq SDK integration using LLaMA models with automatic fallback mechanisms.
- **Resume Parsing**: Cloudinary integration for secure PDF uploads and internal document parsing for deep AI analysis.
- **Job Feed API**: Aggregates, filters, and paginates job listings.
- **Robust Validation**: Zod-based schema validation for all incoming requests.

## 🛠 Tech Stack

- Node.js & Express
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- Groq AI SDK
- Cloudinary (File Management)
- Zod (Validation)

## 📦 Getting Started

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Variables
Create a `.env` file in the root of the `server` directory with the following variables:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/him
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GROQ_API_KEY=your_groq_key
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_FALLBACK_MODEL=llama-3.1-8b-instant
```

### 3. Start the Server
```bash
npm run dev
```
The server will start at `http://localhost:5001`.
