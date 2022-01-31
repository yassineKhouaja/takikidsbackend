import mongoose from "mongoose";

const CommentSchema = mongoose.Schema(
  {
    content: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    publication: { type: mongoose.Schema.Types.ObjectId, ref: "Publication" },
    bannedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    status: {
      type: String,
      enum: ["permitted", "banned"],
      default: "permitted",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", CommentSchema);
