import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("Falta configurar MONGO_URI");
            return;
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB conectado");
    } catch (error) {
        console.error(error);
    }
};
