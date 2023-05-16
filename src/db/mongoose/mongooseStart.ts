import mongoose from "mongoose"

mongoose.Promise = global.Promise

export const mongooseStart = async () => {
    try {
        await mongoose.connect(
            process.env.MONGO_URI!,
            {
                dbName: "formMate"
            }
        )
        console.log("Successfully connected to mongodb");
    } catch(err) {
        console.error(err);
    }
}