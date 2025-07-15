import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
    sectionName: {
        type: String,
    },
    subsections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: "SubSection",
        }
    ]
});

export default mongoose.model("Section", sectionSchema);