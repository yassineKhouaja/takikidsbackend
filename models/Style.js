import mongoose from "mongoose";

const StyleSchema = mongoose.Schema({
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
  typeId: { type: mongoose.Schema.Types.ObjectId, ref: "Type" },
});

export default mongoose.model("Style", StyleSchema);
