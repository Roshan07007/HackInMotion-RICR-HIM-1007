# Mobile App | AI Career Assistant

The cross-platform mobile application for the AI Career Assistant platform. Built using React Native and Expo, offering a native, premium experience with fluid animations and a stunning UI.

## 🚀 Features

- **Premium UI/UX**: Features an "Instagram-style" bottom navigation bar, frosted glass effects, and seamless screen transitions.
- **Mobile Resume Scanner**: Upload PDFs directly from your device storage for deep AI analysis.
- **Native Chat Experience**: Chat with the AI Career Mentor on the go with a mobile-optimized chat interface.
- **Swipeable Job Feed**: Browse and save jobs efficiently on mobile.

## 🛠 Tech Stack

- React Native & Expo
- NativeWind (Tailwind CSS for React Native)
- Expo Router (File-based routing)
- Zustand (State Management)
- Expo Document Picker (File Uploads)

## 📦 Getting Started

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. Environment Variables
Create a `.env` file in the root of the `mobile` directory:
```env
EXPO_PUBLIC_API_URL=http://<YOUR_LOCAL_IP>:5001/api/v1
```
*(Note: Replace `<YOUR_LOCAL_IP>` with your computer's local network IP if testing on a physical device).*

### 3. Start the Expo Server
```bash
npm run dev
```
Use the Expo Go app on your iOS or Android device to scan the QR code and launch the app.
