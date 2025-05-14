import mongoose from "mongoose";

const textSchema = new mongoose.Schema({
    level:{type: String, enum:["hard", "medium", "easy"],  required: true},
    time:{type: Number, required: true},
    language:{type: String, enum:["english", "mongolian"],  required: true},
    text:{type: String,  required: true }
})

export const TextFile = mongoose.model("Text", textSchema);