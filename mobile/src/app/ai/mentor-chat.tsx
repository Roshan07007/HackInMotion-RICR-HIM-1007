import React, { useState, useRef, useEffect } from "react";
import { View, FlatList, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Keyboard } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/Colors";
import { Txt } from "@/components/common/Typography";
import ScreenHeader from "@/components/common/ScreenHeader";
import { toast } from "@/utils/toast";
import { aiService } from "@/services/ai.service";
import Avatar from "@/components/ui/data-display/Avatar";
import { useAuthStore } from "@/store/useAuthStore";
import Markdown from "react-native-markdown-display";

interface Message {
  _id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export default function MentorChatScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];
  const { user } = useAuthStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await aiService.getCareerChat();
      if (res.data?.success && res.data.data?.messages) {
        setMessages(res.data.data.messages);
      }
    } catch (error) {
      toast.error("Error", "Failed to load chat history");
    } finally {
      setInitialLoad(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      _id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await aiService.sendCareerChatMessage(userMessage.content);
      if (res.data?.success && res.data.data?.reply) {
        const aiMessage: Message = {
          _id: (Date.now() + 1).toString(),
          role: "assistant",
          content: res.data.data.reply,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error: any) {
      toast.error("Error", error.response?.data?.message || "Failed to send message");
      // Remove the optimistic message if it failed
      setMessages((prev) => prev.filter((m) => m._id !== userMessage._id));
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === "user";
    return (
      <View style={{
        flexDirection: isUser ? "row-reverse" : "row",
        marginBottom: 20,
        alignItems: "flex-end",
        paddingHorizontal: 16,
      }}>
        <View style={{
          maxWidth: "85%",
          backgroundColor: isUser ? colors.primary : colors.base200,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 20,
          borderBottomRightRadius: isUser ? 4 : 20,
          borderBottomLeftRadius: isUser ? 20 : 4,
          borderWidth: isUser ? 0 : 1,
          borderColor: colors.base300,
        }}>
          {isUser ? (
            <Txt variant="base" style={{ color: "#fff" }}>
              {item.content}
            </Txt>
          ) : (
            <Markdown
              style={{
                body: { color: colors.baseContent, fontSize: 16 },
                paragraph: { marginTop: 0, marginBottom: 8 },
                strong: { color: colors.baseContent, fontWeight: 'bold' },
                em: { color: colors.baseContent, fontStyle: 'italic' },
                code_inline: { backgroundColor: colors.base300, color: colors.baseContent, borderRadius: 4, padding: 4 },
                list_item: { marginBottom: 4 },
              }}
            >
              {item.content}
            </Markdown>
          )}
        </View>
      </View>
    );
  };

  const renderItemWrapper = ({ item, index }: any) => {
    return renderMessage({ item });
  };

  const headerHeightOffset = Platform.OS === "ios" ? 90 : insets.top - 30;

  return (
    <View style={{ flex: 1, backgroundColor: colors.base100 }}>
      <ScreenHeader title="Career Mentor" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={headerHeightOffset}
      >
        <FlatList
          ref={flatListRef}
          data={[...messages].reverse()}
          keyExtractor={(item) => item._id}
          renderItem={renderItemWrapper}
          contentContainerStyle={{ paddingVertical: 20 }}
          inverted={true}
          ListEmptyComponent={
            !initialLoad ? (
              <View className="items-center justify-center mt-20 px-8" style={{ transform: [{ scaleY: -1 }] }}>
                <View className="w-20 h-20 rounded-full items-center justify-center bg-primary/10 mb-6">
                  <MaterialIcons name="chat-bubble-outline" size={40} color={colors.primary} />
                </View>
                <Txt variant="2xl" className="font-bold mb-2">AI Career Mentor</Txt>
                <Txt variant="base" className="opacity-70 text-center">
                  Ask me for resume tips, interview prep, salary negotiation strategies, and more.
                </Txt>
              </View>
            ) : null
          }
        />

        <View style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          paddingBottom: insets.bottom + 12,
          borderTopWidth: 1,
          borderTopColor: colors.base300 + '50',
          backgroundColor: colors.base100,
          flexDirection: "row",
          alignItems: "center",
        }}>
          <View style={{
            flex: 1,
            backgroundColor: colors.base200,
            borderRadius: 24,
            paddingHorizontal: 16,
            paddingVertical: Platform.OS === 'ios' ? 12 : 8,
            flexDirection: "row",
            alignItems: "center",
          }}>
            <TextInput
              style={{
                flex: 1,
                color: colors.baseContent,
                fontSize: 16,
                maxHeight: 100,
              }}
              placeholder="Ask anything..."
              placeholderTextColor={colors.baseContent + '70'}
              value={input}
              onChangeText={setInput}
              multiline
            />
          </View>

          <TouchableOpacity
            onPress={handleSend}
            disabled={!input.trim() || loading}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: input.trim() && !loading ? colors.primary : colors.base300,
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 12,
            }}
          >
            <MaterialIcons
              name="send"
              size={20}
              color={input.trim() && !loading ? "#fff" : colors.baseContent + '50'}
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
