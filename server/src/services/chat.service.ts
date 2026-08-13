/**
 * Chat AI service.
 * Contains all prompts and business logic for the Career Mentor and Mock Interview features.
 */

import { generateAiResponse, ChatMessage } from "./ai.service.js";
import AiConversation from "../models/aiConversation.model.js";
import CareerChat from "../models/careerChat.model.js";
import { getPagination } from "../utils/pagination.js";
import { mockInterviewInitSchema, mockInterviewMessageSchema, careerChatMessageSchema } from "../validations/ai.validation.js";

// ---------------------------------------------------------------------------
// Prompts
// ---------------------------------------------------------------------------

export const MOCK_INTERVIEW_PROMPT = `
You are a Senior Engineering Manager conducting a realistic mock interview. 
The candidate is applying for the specified job role, and you have their resume context.
Ask one interview question at a time. Do not break character. 
Keep your responses conversational, concise, and professional. 
Evaluate their previous answer briefly (if they provided one) and then ask the next question.
`;

export const getCareerMentorPrompt = (preferences: any): string => {
  const tone = preferences?.aiCommunicationStyle || "casual";
  const experience = preferences?.experienceLevel || "intermediate";

  let toneInstruction = "Keep your tone friendly, supportive, and conversational.";
  if (tone === "formal") toneInstruction = "Keep your tone strictly professional, objective, and formal.";
  if (tone === "technical") toneInstruction = "Keep your tone highly technical, precise, and use industry jargon appropriately.";

  return `
You are an elite, highly knowledgeable AI Career Mentor for a software engineer/tech professional.
The user is at a ${experience} experience level.
${toneInstruction}

User Profile Context:
- Skills: ${preferences?.skills?.length ? preferences.skills.join(", ") : "Not specified"}
- Target Roles: ${preferences?.desiredJobs?.length ? preferences.desiredJobs.join(", ") : "Not specified"}
- Target Companies: ${preferences?.desiredCompanies?.length ? preferences.desiredCompanies.join(", ") : "Not specified"}

Your goal is to provide tailored, actionable advice for their career growth, interview preparation, and job search based on this context. 

CRITICAL INSTRUCTION: You MUST heavily format your responses using rich Markdown. 
- Use headings (###) for sections.
- Use **bold** for key terms and emphasis.
- Use bullet points (-) or numbered lists (1.) for step-by-step advice or multiple items.
- If relevant, use \`code blocks\` for any technical keywords or examples.
- Do NOT output raw unstructured text. Make it easy to read and scan.

CONVERSATION RULE: 
- If the user sends a short, simple greeting (like "hi", "hello", "hey"), respond CONCISELY and naturally. Acknowledge them, perhaps briefly mention their target role/skills to show you know their context, and ask how you can help them today. Do NOT generate a long, unsolicited essay of advice. Wait for them to ask a specific question.
`;
};

// ---------------------------------------------------------------------------
// Mock Interview service functions
// ---------------------------------------------------------------------------

/** Create a new mock interview conversation and get the first AI question. */
export const initializeMockInterviewService = async (
  userId: string,
  body: Record<string, any>
) => {
  const validatedData = mockInterviewInitSchema.parse({ body }).body;

  const conversation = new AiConversation({ userId, jobRole: validatedData.jobRole, messages: [] });

  conversation.messages.push({ role: "system", content: MOCK_INTERVIEW_PROMPT });
  conversation.messages.push({
    role: "user",
    content: `I am ready for my mock interview for the ${validatedData.jobRole} position. Here is my resume context:\n${validatedData.resumeText}\n${validatedData.jobDescription ? `Job Description:\n${validatedData.jobDescription}` : ""}\n\nPlease ask the first question.`,
  });

  const aiResponse = await generateAiResponse(
    conversation.messages.map((m) => ({ role: m.role, content: m.content }))
  );

  conversation.messages.push({ role: "assistant", content: aiResponse });
  await conversation.save();
  return conversation;
};

/** Continue a mock interview conversation with the user's answer. */
export const chatMockInterviewService = async (
  userId: string,
  body: Record<string, any>
) => {
  const validatedData = mockInterviewMessageSchema.parse({ body }).body;

  const conversation = await AiConversation.findById(validatedData.conversationId);
  if (!conversation) throw Object.assign(new Error("Conversation not found"), { statusCode: 404 });
  if (conversation.userId.toString() !== userId) throw Object.assign(new Error("Unauthorized"), { statusCode: 403 });

  conversation.messages.push({ role: "user", content: validatedData.message });

  // Keep context window manageable: system prompt + last 10 messages
  const systemMessage = conversation.messages[0];
  const recentMessages = conversation.messages.slice(-10);
  const contextMessages =
    systemMessage.role === "system" && recentMessages[0].role !== "system"
      ? [systemMessage, ...recentMessages]
      : recentMessages;

  const aiResponse = await generateAiResponse(
    contextMessages.map((m) => ({ role: m.role, content: m.content }))
  );

  conversation.messages.push({ role: "assistant", content: aiResponse });
  await conversation.save();
  return conversation;
};

// ---------------------------------------------------------------------------
// Career Mentor service functions
// ---------------------------------------------------------------------------

/** Fetch (or initialise) the career mentor chat for a user, with pagination. */
export const getCareerChatService = async (
  userId: string,
  userPreferences: any,
  page: number,
  limit: number
) => {
  let chat = await CareerChat.findOne({ userId });

  if (!chat) {
    chat = new CareerChat({ userId, messages: [] });
    const systemPrompt = getCareerMentorPrompt(userPreferences);
    chat.messages.push({ role: "system", content: systemPrompt });
    await chat.save();
  }

  const userAndAssistantMessages = chat.messages.filter((m) => m.role !== "system");
  const totalVisible = userAndAssistantMessages.length;

  const skipFromEnd = (page - 1) * limit;
  let paginatedMessages: typeof userAndAssistantMessages = [];
  if (skipFromEnd < totalVisible) {
    const startIdx = Math.max(0, totalVisible - skipFromEnd - limit);
    const endIdx = totalVisible - skipFromEnd;
    paginatedMessages = userAndAssistantMessages.slice(startIdx, endIdx);
  }

  const response = getPagination(paginatedMessages, totalVisible, page, limit);
  return { chatId: chat._id, data: response.data, pagination: response.pagination };
};

/** Send a message to the career mentor and get an AI response. */
export const sendCareerChatMessageService = async (
  userId: string,
  userPreferences: any,
  body: Record<string, any>
) => {
  const validatedData = careerChatMessageSchema.parse({ body }).body;

  const chat = await CareerChat.findOne({ userId });
  if (!chat) throw Object.assign(new Error("Chat not found. Please initialize first."), { statusCode: 404 });

  chat.messages.push({ role: "user", content: validatedData.message });

  // Always refresh the system prompt with the latest user preferences
  const currentSystemPrompt = getCareerMentorPrompt(userPreferences);
  const systemMessageIndex = chat.messages.findIndex((m) => m.role === "system");
  if (systemMessageIndex !== -1) {
    chat.messages[systemMessageIndex].content = currentSystemPrompt;
  } else {
    chat.messages.unshift({ role: "system", content: currentSystemPrompt });
  }

  // Keep context window manageable: system + last 10 messages
  const systemMessage = chat.messages.find((m) => m.role === "system") as ChatMessage;
  const recentMessages = chat.messages.filter((m) => m.role !== "system").slice(-10) as ChatMessage[];
  const contextMessages = [systemMessage, ...recentMessages];

  const aiResponse = await generateAiResponse(
    contextMessages.map((m) => ({ role: m.role, content: m.content }))
  );

  chat.messages.push({ role: "assistant", content: aiResponse });
  await chat.save();

  // Return only the two new messages (user + assistant)
  return chat.messages.slice(-2);
};

/** Delete all chat history for a user. */
export const clearCareerChatService = async (userId: string) => {
  await CareerChat.findOneAndDelete({ userId });
};
