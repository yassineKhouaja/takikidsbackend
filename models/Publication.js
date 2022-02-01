import mongoose from "mongoose";

const modifHistorySchema = mongoose.Schema({
  title: String,
  description: String,
  status: String,
  updatedAt: Date,
  modifiedBy: { type: mongoose.Types.ObjectId, ref: "User" },
});

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
      required: [true, "Please provide a description"],
      maxLength: 1000,
      trim: true,
    },
    status: {
      type: String,
      enum: ["open", "confirmed", "banned"],
      default: "open",
    },
    comments: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    bans: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ban" }],

    history: [modifHistorySchema],
  },
  { timestamps: true }
);

PublicationSchema.pre("remove", async function (next) {
  const comment = mongoose.model("Comment");

  await comment.remove({ _id: { $in: this.comments } });
  next();
});

export default mongoose.model("Publication", PublicationSchema);
