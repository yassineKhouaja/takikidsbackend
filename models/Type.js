import mongoose from "mongoose";

const TypeSchema = mongoose.Schema({
  value: {
    type: String,
    required: [true, "Please provide a valid code"],
    minLength: 3,
    maxLength: 64,
    trim: true,
  },
  option: {
    type: String,
    required: [true, "Please provide a label"],
    maxLength: 256,
    trim: true,
  },
});

export default mongoose.model("Type", TypeSchema);
