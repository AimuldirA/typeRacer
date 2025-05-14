import mongoose from "mongoose";

const typeRacerSchema = new mongoose.Schema({
    user_id: {type: String,  required: true},
    game_type: {type: String,  enum:["alone", "friends", "computer"], required: true},
    level_option:{type: String, enum:["hard", "medium", "easy"], required: true},
    language:{type: String, enum:["mongolian", "english"], required: true}
})

export const TypeRacer = mongoose.model("TypeRacer", typeRacerSchema);