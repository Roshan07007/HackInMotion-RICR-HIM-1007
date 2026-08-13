import mongoose, { Document, Schema } from "mongoose";

export interface IMessage {
  role: "user" | "assistant" | "system";
  content: string;
  createdAt?: Date;
}

export interface ICareerChat extends Document {
  userId: mongoose.Types.ObjectId;
  messages: IMessage[];
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

const careerChatSchema = new Schema<ICareerChat>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One career chat per user
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

const CareerChat = mongoose.model<ICareerChat>("CareerChat", careerChatSchema);

export default CareerChat;
