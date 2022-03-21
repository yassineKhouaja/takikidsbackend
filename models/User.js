import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import validator from "validator";
const UserSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Please provide a Username"],
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide a email"],
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email ",
      },
    },
    password: {
      type: String,
      required: [true, "Please provide a password longer or equal than 6 characters"],
      minLength: 6,
      select: false,
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    publications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Publication",
      },
    ],
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

UserSchema.methods.comparePassword = async function (condidatePassword) {
  const isMatch = await bcrypt.compare(condidatePassword, this.password);
  return isMatch;
};

export default mongoose.model("User", UserSchema);
