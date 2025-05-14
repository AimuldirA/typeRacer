import mongoose from "mongoose";

const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/typeRacer");
        console.log("Mongodb holbogdson");
    } catch(err) {
        console.error('MongoDb holbolt aldaatai', err);
        process.exit(1);
    }
}

export default connectDB;