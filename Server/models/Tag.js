import mongoose, { mongo } from "mongoose";

const tagsSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
});

export default mongoose.model("Tag", tagsSchema);
