import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("❌ MONGO_URI орчны хувьсагч тодорхойлогдоогүй байна!");
    }

    await mongoose.connect(uri);

    console.log("✅ MongoDB Atlas-т холбогдлоо");
  } catch (error) {
    console.error("❌ MongoDB холболтын алдаа:", error);
    process.exit(1);
  }
};

export default connectDB;
