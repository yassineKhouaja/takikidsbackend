import mongoose from "mongoose";

const PublicationSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      minLength: 3,
      maxLength: 100,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "accepted", "banned"],
        message: "Status is required.",
      },
      default: "pending",
    },
    isBanned: { type: Boolean, default: false },
    comments: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Comment",
      },
    ],
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    bannedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

PublicationSchema.pre("remove", async function (next) {
  const comment = mongoose.model("Comment");

  await comment.remove({ _id: { $in: this.comments } });
  next();
});

export default mongoose.model("Publication", PublicationSchema);
