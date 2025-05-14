import mongoose from "mongoose";

const createRoomSchema = new mongoose.Schema({
    room_code:{type: String, required: true, unique:true},
    room_url:{type: String,  required: true, unique:true},
    host:{type: String,  required: true },
    language:{type:String, required:false},
    status:{type: String, enum:["waiting", "started", "finished"],  required: true},
    players: [
        {
          userId: { type: String, required: true },
          name: { type: String, required: true },
          speed: { type: Number, default: null },
          accuracy: { type: Number, default: 0 },
          finished: { type: Boolean, default: false }
        }
      ]
})

export const CreateRoom = mongoose.model("CreateRoom", createRoomSchema);