import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
    user_id:{type: String, required: true},
    room_code:{type:String, required: false},
    speed:{type: Number,  required: true },
    accuracy:{type: Number,  required: true },
    language:{type:String, emun:["mongolian", "english"], required:true},
    place:{type: String,   required: false},
    date:{type: Date,   required: true},
})

scoreSchema.index(
    { user_id: 1, language: 1, room_code: 1 },
    {
      unique: true,
      partialFilterExpression: { room_code: { $ne: null } }
    }
  );
  
export const score = mongoose.model("Score", scoreSchema);