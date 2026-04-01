import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    planType: { type: String, enum: ["Monthly","Quarterly","Yearly"], default: "Monthly" },
    trainer: { type: String, default: "Trainer A" },

    heightCm: { type: Number, default: 170 },
    weightKg: { type: Number, default: 70 },
    goal: { type: String, default: "Fitness" },

    paymentStatus: { type: String, enum: ["paid","unpaid"], default: "unpaid" },
    attendanceCount: { type: Number, default: 0 },

    aiPlan: { type: String, default: "" },

    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("MemberProfile", schema);
