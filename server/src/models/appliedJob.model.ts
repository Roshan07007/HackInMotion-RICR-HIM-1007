import mongoose, { Document, Schema } from "mongoose";

export interface IAppliedJob extends Document {
  userId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  status: "Applied" | "Opened"; // Internal jobs = Applied, External = Opened
  appliedAt: Date;
}

const appliedJobSchema = new Schema<IAppliedJob>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    status: { type: String, enum: ["Applied", "Opened"], required: true },
  },
  { timestamps: { createdAt: "appliedAt", updatedAt: false } }
);

appliedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export default mongoose.model<IAppliedJob>("AppliedJob", appliedJobSchema);
