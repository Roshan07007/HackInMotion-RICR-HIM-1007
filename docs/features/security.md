# Security & Privacy

HireMe ensures that user data—especially sensitive information like resumes, job preferences, and AI chat histories—is kept safe and private.

## Biometric Authentication
- **Mobile Security:** The mobile application integrates native device security. Users can enable **Biometric Lock** (Face ID / Touch ID / Fingerprint) to protect their account.
- **Auto-Lock:** The app can automatically lock itself when sent to the background, requiring biometric verification to reopen, ensuring that your job search and salary expectations remain completely private.

## Data Encryption & Privacy
- **Secure Storage:** JWT tokens and sensitive preferences are stored securely using encrypted local storage (`expo-secure-store` on mobile, secure contexts on web).
- **Backend Protection:** The backend uses standard security practices including Helmet for HTTP headers, API rate limiting, and Bcrypt for password hashing.
