import mongoose from "mongoose";

const connectDB = () => {
    mongoose.connect(process.env.MONGODB_URL!)
        .then(() => {
            console.log("Database connected");
        })
        .catch((err) => {
            console.log(err);
            process.exit(1);
        });
}

export default connectDB;