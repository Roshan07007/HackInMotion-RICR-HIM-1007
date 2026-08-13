# AI Mock Video Interviews

The Video Interview feature is one of HireMe's most advanced offerings, simulating real-world job interviews using AI.

## How It Works
1. **Context Setup:** Users provide a target job role, company name, and optionally paste their resume or a job description.
2. **Dynamic Generation:** Using the Groq API (LLaMA-3), the system generates tailored, role-specific interview questions on the fly.
3. **Interactive Session:** 
   - Uses device camera and microphone (via Expo Speech Recognition / Native APIs).
   - Transcribes user answers in real-time.
   - The AI acts as the recruiter, asking follow-up questions based on the candidate's answers.
4. **Video Saving (Optional):** For "recruiter" type interviews, the platform supports recording and securely saving the video (via Cloudinary/S3) so that human recruiters or mentors can review the tape later.
5. **Final Interview Report:**
   - Once the interview concludes, the AI evaluates the entire transcript.
   - It generates a comprehensive Interview Report with an executive summary and rates the candidate on Technical Skills, Communication, and Confidence.
   - It provides a definitive "Hireability Rating" (e.g., "Strong Hire", "Reject") along with actionable strengths and weaknesses.
6. **Interview History:** All past mock interviews, transcripts, and final reports are permanently saved in the user's history, allowing them to review their progress and replay feedback at any time.
