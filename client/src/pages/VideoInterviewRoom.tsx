import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LogOut, Mic, MicOff, Video, VideoOff, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../config/api";

// @ts-ignore
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const VideoInterviewRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const [aiMessage, setAiMessage] = useState("Connecting to AI...");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  // Video Recording Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Refs for callbacks
  const isListeningRef = useRef(isListening);
  useEffect(() => { isListeningRef.current = isListening; }, [isListening]);

  const isFinishedRef = useRef(false);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      // Optional: choose a female/specific voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.name.includes("Google UK English Female") || v.name.includes("Samantha"));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.onend = () => {
        if (isFinishedRef.current) {
          handleEndInterview();
          return;
        }
        // Auto-resume listening when AI finishes speaking
        if (!isListeningRef.current && recognitionRef.current) {
          setTranscript("");
          recognitionRef.current.start();
          setIsListening(true);
        }
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    // Load voices early
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  useEffect(() => {
    // Setup Webcam
    const setupMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: { ideal: 640 }, height: { ideal: 480 } }, 
          audio: true 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        // Initialize MediaRecorder for compressed recording
        if (!mediaRecorderRef.current) {
          try {
            let options: any = { mimeType: 'video/webm;codecs=vp8,opus', videoBitsPerSecond: 250000 };
            if (typeof MediaRecorder !== 'undefined') {
              if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                options = { mimeType: 'video/webm', videoBitsPerSecond: 250000 };
              }
              const mediaRecorder = new MediaRecorder(mediaStream, options);
              mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
              };
              mediaRecorder.start(1000);
              mediaRecorderRef.current = mediaRecorder;
            }
          } catch (e) {
            console.warn("MediaRecorder creation failed", e);
          }
        }
      } catch (error) {
        toast.error("Failed to access camera/microphone.");
        console.error(error);
      }
    };
    setupMedia();

    // Setup Speech Recognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
      };

      recognitionRef.current = recognition;
    } else {
      toast.error("Speech recognition is not supported in this browser.");
    }

    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    // Fetch initial interview state
    const fetchInterview = async () => {
      try {
        const { data } = await api.get(`/video-interview/${id}`);
        if (data.data.status === "evaluated" || data.data.status === "completed") {
          toast.error("This interview has already been completed.");
          navigate(`/interview/${id}/report`);
          return;
        }

        const transcript = data.data.transcript;
        if (transcript && transcript.length > 0) {
          const lastMsg = transcript[transcript.length - 1].content;
          setAiMessage(lastMsg);
          speakText(lastMsg);
        }
      } catch (error) {
        console.error("Failed to load interview", error);
        toast.error("Failed to load interview state");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchInterview();
  }, [id]);

  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      recognitionRef.current?.start();
      setIsListening(true);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
  };

  const handleSubmitAnswer = async (textToSubmit = transcript) => {
    if (!textToSubmit.trim()) {
      toast.error("Please provide an answer before submitting.");
      return;
    }
    
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    setIsSubmitting(true);
    try {
      const { data } = await api.post("/video-interview/answer", {
        interviewId: id,
        answer: textToSubmit
      });
      
      if (data.data.isFinished) {
        isFinishedRef.current = true;
      }

      const nextQ = data.data.assistantQuestion.content;
      setAiMessage(nextQ);
      setTranscript("");
      speakText(nextQ);
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit answer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndInterview = async () => {
    setIsEnding(true);

    const submitFinalize = async (blob: Blob | null) => {
      if (stream) stream.getTracks().forEach(track => track.stop());
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      
      try {
        if (blob) {
          const formData = new FormData();
          formData.append("video", blob, "interview.webm");
          await api.post(`/video-interview/${id}/finalize`, formData, {
            headers: {
              "Content-Type": undefined
            }
          });
        } else {
          await api.post(`/video-interview/${id}/finalize`);
        }
        navigate(`/interview/${id}/report`);
      } catch (error) {
        console.error(error);
        toast.error("Failed to end interview properly");
        navigate("/home");
      } finally {
        setIsEnding(false);
      }
    };

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        await submitFinalize(blob);
      };
      mediaRecorderRef.current.stop();
    } else {
      await submitFinalize(null);
    }
  };

  const handleExit = () => {
    if (stream) stream.getTracks().forEach(track => track.stop());
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    navigate("/home");
  };

  // Silence detection effect
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (isListening && transcript.trim().length > 0) {
      timeoutId = setTimeout(() => {
        handleSubmitAnswer(transcript);
      }, 3000); // 3 seconds of silence triggers auto-submit
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [transcript, isListening]);

  return (
    <div className="h-screen overflow-hidden bg-[#1e1e1e] text-white flex flex-col font-sans">
      {/* Top Navbar */}
      <div className="flex justify-between items-center px-4 md:px-6 py-3 md:py-4 border-b border-gray-700 shrink-0">
        <div className="text-lg md:text-xl font-bold tracking-wider text-primary flex items-center gap-2">
          HACKINMOTION <span className="text-xs md:text-sm bg-primary/20 px-2 py-0.5 rounded text-primary hidden sm:inline-block">INTERVIEW</span>
        </div>
        <button 
          onClick={handleExit}
          className="flex items-center gap-2 border border-gray-600 hover:bg-gray-700 px-3 md:px-4 py-1.5 md:py-2 rounded-md transition text-xs md:text-sm"
        >
          <LogOut size={16} /> Exit
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 flex flex-col p-4 md:p-6 mx-auto w-full gap-4 md:gap-6">
        
        {/* Split Screen Video Area */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 flex-1 min-h-0">
          
          {/* AI Interviewer (Left) */}
          <div className="flex-1 bg-[#2a2a2a] rounded-xl overflow-hidden relative border-2 border-primary/80 shadow-lg shadow-primary/20 flex items-center justify-center">
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-[#3a3a3a]">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" 
                alt="AI Interviewer" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-4 left-4 bg-[#1f1f1f] px-4 py-1.5 rounded-full text-sm font-medium">
              Interviewer (IRA)
            </div>
          </div>

          {/* Candidate Video (Right) */}
          <div className="flex-1 bg-[#2a2a2a] rounded-xl overflow-hidden relative border border-gray-700">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover mirror"
              style={{ transform: "scaleX(-1)" }}
            />
            {/* Rec Badge */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 border border-gray-600">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
              Rec
            </div>
            {/* Name Badge */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium border border-gray-600">
              Candidate
            </div>
          </div>
        </div>

        {/* Transcription Area */}
        <div className="bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 md:p-5 relative h-[140px] md:h-[160px] shrink-0 overflow-y-auto">
          <div className="inline-block bg-gray-600/50 text-gray-300 text-[10px] md:text-xs font-semibold px-2 py-0.5 md:px-2.5 md:py-1 rounded mb-2 md:mb-3">
            Transcription
          </div>
          <p className="text-gray-200 leading-relaxed text-sm">
            {loading ? "Loading interview..." : aiMessage}
          </p>
          {(isListening || transcript) && (
            <p className="text-gray-400 mt-2 italic text-sm border-l-2 border-primary pl-3">
              You: {transcript}
            </p>
          )}
          {isSubmitting && (
            <p className="text-primary mt-2 text-sm flex items-center gap-2">
              <span className="loading loading-dots loading-sm"></span> AI is analyzing your response...
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center flex-wrap gap-2 md:gap-4 shrink-0 pb-2 md:pb-0">
          <button 
            onClick={toggleMic}
            className={`p-3 md:p-4 rounded-full ${isMicOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/50'}`}
          >
            {isMicOn ? <Mic size={20} className="md:w-6 md:h-6" /> : <MicOff size={20} className="md:w-6 md:h-6" />}
          </button>
          <button 
            onClick={toggleVideo}
            className={`p-3 md:p-4 rounded-full ${isVideoOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/50'}`}
          >
            {isVideoOn ? <Video size={20} className="md:w-6 md:h-6" /> : <VideoOff size={20} className="md:w-6 md:h-6" />}
          </button>
          {/* Toggle Mic Button */}
          <button
            onClick={toggleListening}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-bold transition flex items-center gap-1 md:gap-2 text-sm md:text-base ${isListening ? 'bg-red-500/20 text-red-500 border border-red-500 hover:bg-red-500/30' : 'bg-primary/20 text-primary border border-primary hover:bg-primary/30'}`}
            disabled={isSubmitting || loading}
          >
            {isListening ? (
              <>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                Stop Recording
              </>
            ) : (
              "Start Speaking"
            )}
          </button>
          
          {/* Submit Answer Button */}
          <button
            onClick={() => handleSubmitAnswer(transcript)}
            className="px-4 md:px-6 py-2 md:py-3 rounded-full font-bold transition flex items-center gap-2 bg-primary text-primary-content hover:opacity-90 disabled:opacity-50 text-sm md:text-base"
            disabled={isSubmitting || loading || !transcript}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Submit Answer"
            )}
          </button>

          {/* End Interview Button */}
          <button
            onClick={handleEndInterview}
            className="px-4 md:px-6 py-2 md:py-3 rounded-full font-bold transition flex items-center gap-1 md:gap-2 bg-success text-success-content hover:opacity-90 ml-auto disabled:opacity-50 text-sm md:text-base"
            disabled={isEnding || isSubmitting || loading}
          >
            {isEnding ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                <CheckCircle size={18} /> Finish
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoInterviewRoom;
