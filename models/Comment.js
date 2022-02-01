import mongoose from "mongoose";

const CommentSchema = mongoose.Schema(
  {
    content: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    publication: { type: mongoose.Schema.Types.ObjectId, ref: "Publication" },
    bans: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ban" }],

    status: {
      type: String,
      enum: ["open", "banned"],
      default: "open",
    },
  },
  { timestamps: true }
);

CommentSchema.pre("remove", async function (next) {
  const Publication = mongoose.model("Publication");
  await Publication.findByIdAndUpdate(this.publication, {
    $pull: { comments: this._id },
  });

  next();
});

export default mongoose.model("Comment", CommentSchema);
