import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { setHeader } from "../utils/setHeader";
import { aiService } from "../services/aiService";
import {
  Send,
  User as UserIcon,
  Bot,
  MoreHorizontal,
  Briefcase,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import ConfirmModal from "../components/common/ConfirmModal";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

const AiMentor = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [fetchingPrevious, setFetchingPrevious] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const shouldScrollToBottomRef = useRef(false);

  // Synchronous scroll before browser paint to prevent flicker
  useLayoutEffect(() => {
    if (shouldScrollToBottomRef.current) {
      scrollToBottom(false);
      shouldScrollToBottomRef.current = false;
    }
  }, [messages]);

  // Initialize and load page 1
  useEffect(() => {
    setHeader(
      "AI Mentor",
      <button
        className="btn btn-outline border-0 btn-circle text-error hover:bg-error/20"
        onClick={() => setIsConfirmModalOpen(true)}
        title="Clear Chat"
      >
        <Trash2 size={20} />
      </button>,
    );
    loadMessages(1);
    return () => {
      setHeader();
    };
  }, []);

  const loadMessages = async (pageNumber: number) => {
    if (pageNumber === 1) setLoading(true);
    else setFetchingPrevious(true);

    try {
      const response = await aiService.getCareerChat(pageNumber, 20);
      const resData = response.data;
      const messagesData = resData.data?.messages || [];
      const paginationData = resData.data?.pagination || {
        hasMore: false,
        page: 1,
      };

      if (pageNumber === 1) {
        setMessages(messagesData);
        shouldScrollToBottomRef.current = true;
      } else {
        // Prepend previous messages, maintain scroll position
        const container = chatContainerRef.current;
        const scrollHeightBefore = container ? container.scrollHeight : 0;

        setMessages((prev) => [...messagesData, ...prev]);

        // Restore scroll position after prepend
        setTimeout(() => {
          if (container) {
            container.scrollTop = container.scrollHeight - scrollHeightBefore;
          }
        }, 10);
      }

      setHasMore(paginationData.hasMore);
      setPage(paginationData.page);
    } catch (error) {
      toast.error("Failed to load chat history");
    } finally {
      setLoading(false);
      setFetchingPrevious(false);
    }
  };

  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (!container) return;

    // If scrolled to top and not already fetching and we have more
    if (container.scrollTop === 0 && !fetchingPrevious && hasMore) {
      loadMessages(page + 1);
    }
  };

  const scrollToBottom = (smooth: boolean = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || sending) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setTimeout(() => scrollToBottom(), 50);

    setSending(true);
    try {
      const response = await aiService.sendCareerChatMessage(userMessage);
      // Replace last 2 messages (user, assistant) with what backend returns, or just append the assistant's new message
      // Actually backend returns the last 2 messages. The last one is assistant.
      const reply = response.data?.data?.reply;
      if (reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      }
      setTimeout(() => scrollToBottom(), 50);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleClearChat = async () => {
    setClearing(true);
    try {
      await aiService.clearCareerChat();
      toast.success("Chat cleared!");
      setMessages([]);
      setIsConfirmModalOpen(false);
      // Reload a fresh page 1
      loadMessages(1);
    } catch (error) {
      toast.error("Failed to clear chat");
    } finally {
      setClearing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center fade-in">
        <span className="loading loading-spinner text-primary loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-70px)] flex flex-col fade-in">
      <div className="bg-base-200/20 flex flex-col flex-1 overflow-hidden h-full">
        {/* Chat Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6"
          ref={chatContainerRef}
          onScroll={handleScroll}
        >
          {fetchingPrevious && (
            <div className="flex justify-center py-2 fade-in">
              <div className="bg-base-300/50 px-4 py-2 rounded-full shadow border border-base-300/50 flex items-center gap-2">
                <span className="loading loading-dots loading-xs text-base-content/50"></span>
              </div>
            </div>
          )}

          {!loading && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-base-content/50 animate-in fade-in duration-500">
              <div className="bg-base-200/50 p-6 rounded-full mb-4 shadow border border-base-300">
                <Bot size={48} className="text-primary opacity-80" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-base-content/80">
                Start your conversation
              </h3>
              <p className="text-center max-w-sm text-sm">
                Send a message below to start chatting with your personalized AI
                Career Mentor. I'm here to help you with interview prep, resume
                reviews, and career advice!
              </p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex w-full animate-in slide-in-from-bottom-2 duration-300 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {/* Message Content */}
              <div
                className={`flex flex-col max-w-[85%] md:max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                
                <div
                  className={`p-4 shadow text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-content rounded-3xl rounded-br-sm"
                      : "bg-base-100 text-base-content border border-base-300/60 rounded-3xl rounded-bl-sm"
                  }`}
                >
                  {msg.role === "user" ? (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <div
                      className="prose prose-sm max-w-none break-words
                      prose-p:leading-relaxed prose-pre:bg-base-300 prose-pre:text-base-content
                      prose-a:text-primary prose-strong:text-current prose-headings:text-current
                      dark:prose-invert"
                    >
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex w-full justify-start animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex flex-col items-start max-w-[85%] md:max-w-[75%]">
                <div className="bg-base-100 border border-base-300/60 p-4 rounded-3xl rounded-bl-sm shadow flex items-center justify-center">
                  <MoreHorizontal className="animate-pulse opacity-50" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-base-100/60 border-t border-base-300/50 backdrop-blur-xl">
          <form
            onSubmit={handleSend}
            className="flex gap-2 items-center max-w-5xl mx-auto"
          >
            <input
              type="text"
              placeholder="Ask for advice, mock interview questions, or resume tips..."
              className="input input-bordered w-full rounded-full bg-base-200/50 focus:bg-base-100 focus:outline-primary transition-all shadow-inner px-6"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={sending}
            />
            <button
              type="submit"
              className={`btn btn-primary btn-circle shadow-lg hover:shadow-primary/40 hover:scale-105 transition-all ${sending ? "opacity-50" : ""}`}
              disabled={!inputValue.trim() || sending}
            >
              <Send
                size={18}
                className={inputValue.trim() ? "translate-x-0.5" : ""}
              />
            </button>
          </form>
        </div>
      </div>

      {/* Clear Chat Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleClearChat}
        title="Clear Career Chat"
        message={
          <>
            Are you sure you want to clear your entire chat history with the
            Career Mentor?
            <strong> This action cannot be undone.</strong>
          </>
        }
        type="danger"
        confirmText="Clear Chat"
        isLoading={clearing}
      />
    </div>
  );
};

export default AiMentor;
