import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Speech from "expo-speech";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

import { Colors } from "@/constants/Colors";
import { Txt } from "@/components/common/Typography";
import { HStack } from "@/components/ui/layout/Stack";
import Button from "@/components/ui/buttons/Button";
import { toast } from "@/utils/toast";
import { api } from "@/config/api";
import ConfirmationToast from "@/components/common/ConfirmationToast";

export default function MobileInterviewRoomScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];

  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(true);

  const [aiMessage, setAiMessage] = useState("Connecting to AI...");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcriptInput, setTranscriptInput] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Refs for real-time video call feel & recording
  const transcriptRef = useRef("");
  const isSubmittingRef = useRef(false);
  const isListeningRef = useRef(false);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const cameraRef = useRef<CameraView>(null);
  const videoPromiseRef = useRef<Promise<{ uri: string } | undefined> | null>(null);
  const isRecordingRef = useRef(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const aiBubbleAnim = useRef(new Animated.Value(0)).current;
  const micPulseAnim = useRef(new Animated.Value(1)).current;
  const micBubbleAnim = useRef(new Animated.Value(1)).current;

  // Keep refs in sync with state
  useEffect(() => { transcriptRef.current = transcriptInput; }, [transcriptInput]);
  useEffect(() => { isSubmittingRef.current = isSubmitting; }, [isSubmitting]);
  useEffect(() => { isListeningRef.current = isListening; }, [isListening]);

  // ─── Animations ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (isAiSpeaking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.05, duration: 600, useNativeDriver: false }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 600, useNativeDriver: false }),
        ])
      ).start();
      aiBubbleAnim.setValue(0);
      Animated.loop(
        Animated.timing(aiBubbleAnim, { toValue: 1, duration: 1500, useNativeDriver: false })
      ).start();
    } else {
      scaleAnim.setValue(1);
      aiBubbleAnim.stopAnimation();
      aiBubbleAnim.setValue(0);
    }
  }, [isAiSpeaking]);

  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(micPulseAnim, { toValue: 1.08, duration: 500, useNativeDriver: false }),
          Animated.timing(micPulseAnim, { toValue: 1, duration: 500, useNativeDriver: false }),
        ])
      ).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(micBubbleAnim, { toValue: 1.8, duration: 700, useNativeDriver: false }),
          Animated.timing(micBubbleAnim, { toValue: 1, duration: 700, useNativeDriver: false }),
        ])
      ).start();
    } else {
      micPulseAnim.stopAnimation();
      micPulseAnim.setValue(1);
      micBubbleAnim.stopAnimation();
      micBubbleAnim.setValue(1);
    }
  }, [isListening]);

  // ─── Speech recognition events (use refs — never stale) ─────────────────────

  useSpeechRecognitionEvent("start", () => {
    setIsListening(true);
  });

  useSpeechRecognitionEvent("end", () => {
    setIsListening(false);
    // Auto-submit for real-time video call feel
    if (transcriptRef.current.trim() && !isSubmittingRef.current) {
      setTimeout(() => {
        handleSubmitAnswer();
      }, 300);
    }
  });

  useSpeechRecognitionEvent("error", (event) => {
    console.warn("Voice recognition error:", event.error);
    setIsListening(false);
  });

  useSpeechRecognitionEvent("result", (event) => {
    const transcript = event.results[0]?.transcript;
    if (transcript) {
      setTranscriptInput(transcript);
      
      // Real-time voice interaction: if user pauses for 1.5 seconds, auto-submit!
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        if (isListeningRef.current && transcriptRef.current.trim() && !isSubmittingRef.current) {
          handleSubmitAnswer();
        }
      }, 1500);
    }
  });

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  const startListening = useCallback(async () => {
    try {
      if (isListeningRef.current) {
        await ExpoSpeechRecognitionModule.stop();
      }
      setTranscriptInput("");
      const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!perm.granted) {
        toast.error("Permission denied", "Microphone access is required.");
        return;
      }
      await ExpoSpeechRecognitionModule.start({ lang: "en-US", interimResults: true });
    } catch (e) {
      console.error("startListening error:", e);
    }
  }, []);

  const speakText = useCallback(
    (text: string) => {
      Speech.stop();
      Speech.speak(text, {
        rate: 1.0,
        onStart: () => setIsAiSpeaking(true),
        onDone: () => {
          setIsAiSpeaking(false);
          // Automatically open mic after AI finishes speaking
          setTimeout(() => startListening(), 600);
        },
        onStopped: () => setIsAiSpeaking(false),
        onError: () => setIsAiSpeaking(false),
      });
    },
    [startListening]
  );

  // ─── Data ─────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const { data } = await api.get(`/video-interview/${id}`);
        if (
          data.data.status === "evaluated" ||
          data.data.status === "completed"
        ) {
          toast.error("Error", "This interview has already been completed.");
          router.replace(`/interview/report/${id}` as any);
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
        toast.error("Error", "Failed to load interview");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchInterview();

    return () => {
      Speech.stop();
    };
  }, [id]);

  // ─── Actions ──────────────────────────────────────────────────────────────────

  const handleSubmitAnswer = async () => {
    const answer = transcriptRef.current.trim();
    if (!answer) {
      toast.error("Empty", "Please speak or type your answer first.");
      return;
    }
    if (isSubmittingRef.current) return;

    setIsSubmitting(true);
    try {
      // Stop mic if still open
      if (isListeningRef.current) {
        await ExpoSpeechRecognitionModule.stop();
      }

      const { data } = await api.post("/video-interview/answer", {
        interviewId: id,
        answer,
      });

      const nextQ = data.data.assistantQuestion.content;
      setAiMessage(nextQ);
      setTranscriptInput("");
      speakText(nextQ);
    } catch (error) {
      console.error(error);
      toast.error("Error", "Failed to submit answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndInterview = async () => {
    setIsEnding(true);
    try {
      if (isListeningRef.current) {
        await ExpoSpeechRecognitionModule.stop();
      }
      Speech.stop();

      // Stop recording and await the file
      let finalUri = null;
      if (isRecordingRef.current && cameraRef.current) {
        cameraRef.current.stopRecording();
        const video = await videoPromiseRef.current;
        if (video?.uri) {
          finalUri = video.uri;
        }
      }

      if (finalUri) {
        const formData = new FormData();
        formData.append("video", {
          uri: finalUri,
          name: "interview.mp4",
          type: "video/mp4",
        } as any);

        await api.post(`/video-interview/${id}/finalize`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post(`/video-interview/${id}/finalize`);
      }

      router.replace(`/interview/report/${id}` as any);
    } catch (error) {
      console.error(error);
      toast.error("Error", "Failed to end interview properly.");
      router.replace("/" as any);
    } finally {
      setIsEnding(false);
    }
  };

  const handleExit = () => {
    setShowConfirmation(true);
  };

  const confirmExit = () => {
    Speech.stop();
    ExpoSpeechRecognitionModule.stop();
    router.back();
  };

  const toggleMic = async () => {
    if (isListeningRef.current) {
      // Manual stop also triggers submit if there's text
      if (transcriptRef.current.trim() && !isSubmittingRef.current) {
        handleSubmitAnswer();
      } else {
        await ExpoSpeechRecognitionModule.stop();
      }
    } else {
      await startListening();
    }
  };

  // ─── Guards ────────────────────────────────────────────────────────────────────

  if (!permission) {
    return (
      <View className="flex-1 justify-center items-center bg-base-100">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-base-100 p-6">
        <Ionicons name="camera-outline" size={64} color={colors.baseContent} />
        <Txt variant="lg" className="text-center font-bold mt-4 mb-2">
          Camera & Mic Access Required
        </Txt>
        <Txt variant="base" className="text-center opacity-70 mb-6">
          We need your permission to show the camera and listen to your voice.
        </Txt>
        <Button label="Grant Permission" onPress={requestPermission} />
        <Button
          label="Exit"
          variant="ghost"
          onPress={() => router.back()}
          style={{ marginTop: 12 }}
        />
      </View>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.base100 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Uploading/Finishing Overlay */}
      {isEnding && (
        <View 
          className="absolute inset-0 z-[100] items-center justify-center p-8"
          style={{ backgroundColor: colors.base100 }}
        >
          <View className="w-24 h-24 rounded-full bg-primary/10 items-center justify-center mb-6">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
          <Txt variant="2xl" className="font-bold mb-3 text-center tracking-tight">Finishing up...</Txt>
          <Txt variant="base" className="text-center opacity-70 mb-2">
            Securely uploading your video and processing your responses.
          </Txt>
          <Txt variant="sm" className="text-center text-primary font-medium mt-4">
            This may take a few moments.
          </Txt>
        </View>
      )}

      {/* Header */}
      <View className="z-50 bg-base-100 border-b border-base-300/50">
        <HStack
          align="center"
          justify="space-between"
          className="px-4 pb-3"
          style={{ paddingTop: insets.top > 0 ? insets.top + 10 : 20 }}
        >
          <HStack align="center">
            <Ionicons name="videocam" size={24} color={colors.primary} />
            <Txt variant="lg" className="font-bold tracking-tight text-primary ml-2">
              Live Interview
            </Txt>
          </HStack>
          <TouchableOpacity
            onPress={handleExit}
            className="px-3 py-1.5 rounded-lg border border-base-content/20 flex-row items-center"
          >
            <Ionicons name="log-out-outline" size={16} color={colors.baseContent} />
            <Txt variant="sm" className="ml-1 font-medium">
              Exit
            </Txt>
          </TouchableOpacity>
        </HStack>
      </View>

      <View className="flex-1 p-4">
        {/* Video area */}
        <View className="h-[45%] w-full bg-base-200 rounded-3xl overflow-hidden mb-4 relative shadow-sm border border-base-300">
          {/* AI Interviewer */}
          <View className="absolute inset-0 items-center justify-center bg-base-300">
            {/* AI bubble */}
            {isAiSpeaking && (
              <Animated.View
                style={{
                  position: "absolute",
                  width: 140,
                  height: 140,
                  borderRadius: 70,
                  backgroundColor: colors.primary,
                  opacity: aiBubbleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.6, 0],
                  }),
                  transform: [
                    {
                      scale: aiBubbleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 2.5],
                      }),
                    },
                  ],
                }}
              />
            )}
            <Animated.View
              style={{ transform: [{ scale: scaleAnim }] }}
              className={`w-32 h-32 rounded-full overflow-hidden border-4 ${
                isAiSpeaking ? "border-primary" : "border-primary/20"
              } z-10`}
            >
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
                }}
                style={{ width: "100%", height: "100%" }}
              />
            </Animated.View>
            <View className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-full z-20">
              <Txt variant="xs" style={{ color: "white" }}>
                Interviewer (IRA)
              </Txt>
            </View>
          </View>

          {/* User video (PiP) */}
          {cameraActive && (
            <View
              className={`absolute bottom-4 right-4 w-[100px] h-[140px] rounded-xl overflow-hidden border-2 shadow-xl bg-black ${
                isListening ? "border-error" : "border-white"
              } z-30`}
            >
              <CameraView 
                ref={cameraRef}
                style={{ flex: 1 }} 
                facing="front" 
                mirror={true} 
                mode="video"
                onCameraReady={() => {
                  if (!isRecordingRef.current && cameraRef.current) {
                    isRecordingRef.current = true;
                    videoPromiseRef.current = cameraRef.current.recordAsync();
                  }
                }}
              />
              
              <View 
                style={{ opacity: isListening ? 1 : 0 }}
                className="absolute top-2 right-2 flex-row items-center bg-black/60 px-2 py-1 rounded-full border border-gray-600"
              >
                <View className="w-1.5 h-1.5 rounded-full bg-error mr-1" />
                <Txt variant="xs" style={{ color: "white", fontSize: 10 }}>
                  Rec
                </Txt>
              </View>
            </View>
          )}
        </View>

        {/* AI question */}
        <View className="flex-1 bg-base-200 border border-base-300 rounded-2xl p-4 mb-4">
          <Txt variant="xs" className="font-bold opacity-60 mb-2 uppercase">
            Interviewer asks:
          </Txt>
          <ScrollView className="flex-1">
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Txt variant="base" className="leading-relaxed">
                {aiMessage}
              </Txt>
            )}
          </ScrollView>
        </View>

        {/* User Input Area (Now styled as Live Captions & Controls) */}
        <View className="w-full">
          {/* Live Captions (Only show when there is text) */}
          {(transcriptInput.trim() || isSubmitting) && (
            <View className="bg-black/60 rounded-xl px-4 py-3 mb-3 backdrop-blur-md self-center w-full max-w-sm">
              {isSubmitting ? (
                <HStack align="center" justify="center">
                  <ActivityIndicator size="small" color="white" />
                  <Txt variant="sm" style={{ color: "white", marginLeft: 8 }}>Sending response...</Txt>
                </HStack>
              ) : (
                <Txt variant="sm" style={{ color: "white", textAlign: "center" }} numberOfLines={3}>
                  "{transcriptInput}"
                </Txt>
              )}
            </View>
          )}

          {/* Controls Bar */}
          <HStack justify="space-between" align="center" className="bg-base-200 p-2 rounded-full border border-base-300">
            {/* End Call */}
            <TouchableOpacity
              onPress={handleEndInterview}
              disabled={isEnding || isSubmitting}
              className="w-12 h-12 rounded-full items-center justify-center bg-error/10"
            >
              {isEnding ? (
                <ActivityIndicator size="small" color={colors.error} />
              ) : (
                <Ionicons name="call" size={20} color={colors.error} style={{ transform: [{ rotate: "135deg" }] }} />
              )}
            </TouchableOpacity>

            {/* Main Mic Button */}
            <View className="relative">
              {isListening && (
                <Animated.View
                  pointerEvents="none"
                  style={{
                    position: "absolute",
                    left: -8,
                    top: -8,
                    width: 72,
                    height: 72,
                    borderRadius: 36,
                    backgroundColor: colors.error,
                    opacity: micBubbleAnim.interpolate({
                      inputRange: [1, 1.8],
                      outputRange: [0.4, 0],
                    }),
                    transform: [{ scale: micBubbleAnim }],
                    zIndex: 1,
                  }}
                />
              )}
              <Animated.View style={{ transform: [{ scale: micPulseAnim }], zIndex: 2 }}>
                <TouchableOpacity
                  onPress={toggleMic}
                  activeOpacity={0.8}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isListening ? colors.error : colors.primary,
                    shadowColor: isListening ? colors.error : colors.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <Ionicons
                    name={isListening ? "mic" : "mic-outline"}
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>

            {/* Camera Toggle */}
            <TouchableOpacity
              onPress={() => setCameraActive(!cameraActive)}
              className="w-12 h-12 rounded-full items-center justify-center bg-base-300"
            >
              <Ionicons
                name={cameraActive ? "videocam" : "videocam-off"}
                size={20}
                color={colors.baseContent}
              />
            </TouchableOpacity>
          </HStack>
        </View>
      </View>
      
      {showConfirmation && (
        <ConfirmationToast
          name="Exit Interview"
          message="Are you sure you want to leave? Your progress so far is saved."
          fun={confirmExit}
          setShow={setShowConfirmation}
        />
      )}
    </KeyboardAvoidingView>
  );
}
