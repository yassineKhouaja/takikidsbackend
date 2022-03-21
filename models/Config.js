import mongoose from "mongoose";

const ConfigSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Please provide a valid code"],
      minLength: 3,
      maxLength: 64,
      trim: true,
    },
    label: {
      type: String,
      required: [true, "Please provide a label"],
      maxLength: 256,
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Please provide a description"],
      maxLength: 512,
      trim: true,
    },
    data: {
      type: String,
      required: [true, "Please provide a data"],
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Config", ConfigSchema);
