import mongoose from "mongoose";

const modifHistorySchema = mongoose.Schema({
  status: String,
  status: String,
  updatedAt: Date,
  adminId: { type: mongoose.Types.ObjectId, ref: "User" },
});

const CommentSchema = mongoose.Schema(
  {
    publication: { type: mongoose.Schema.Types.ObjectId, ref: "Publication" },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
    bannedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },

    history: [modifHistorySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Ban", CommentSchema);
