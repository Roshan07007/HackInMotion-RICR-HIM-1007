import mongoose, { Document, Schema } from "mongoose";

export interface IMessage {
  role: "user" | "assistant" | "system";
  content: string;
  createdAt?: Date;
}

export interface IAiConversation extends Document {
  userId: mongoose.Types.ObjectId;
  jobRole: string; // The target job role
  messages: IMessage[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { _id: false, timestamps: { createdAt: true, updatedAt: false } }
);

const aiConversationSchema = new Schema<IAiConversation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobRole: {
      type: String,
      required: true,
    },
    messages: [messageSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const AiConversation = mongoose.model<IAiConversation>("AiConversation", aiConversationSchema);

export default AiConversation;
