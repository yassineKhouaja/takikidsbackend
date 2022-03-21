import mongoose from "mongoose";

const modifHistorySchema = mongoose.Schema({
  status: String,
  updatedAt: Date,
  adminId: { type: mongoose.Types.ObjectId, ref: "User" },
});

const BanSchema = mongoose.Schema(
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

BanSchema.pre("remove", async function (next) {
  const Comment = mongoose.model("Comment");

  const idParent = this.comment || this.publication;
  const filedParenst = this.comment ? "comments" : "publications";

  await Comment.findByIdAndUpdate(idParent, {
    $pull: { [filedParenst]: this._id },
  });

  next();
});

export default mongoose.model("Ban", BanSchema);
