import mongoose from "mongoose";

const CommentSchema = mongoose.Schema(
  {
    publication: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
    bannedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    status: {
      type: String,
      enum: ["pending", "banned"],
      default: "pending",
    },
  },
  { timestamps: true }
  // timestamps: { createdAt: true, updatedAt: false }
);

// CommentSchema.pre("remove", async function (next) {
//   const Publication = mongoose.model("Publication");
//   await Publication.findByIdAndUpdate(this.publication, {
//     $pull: { comments: this._id },
//   });

//   next();
// });

export default mongoose.model("Ban", CommentSchema);
