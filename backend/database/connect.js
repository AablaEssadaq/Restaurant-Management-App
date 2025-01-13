import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export const connectDb = async() => {
    try {
        await mongoose.connect(process.env.DATABASE_CONNECTION_URL);
        console.log(`Connected to database ${process.env.DATABASE_NAME} successfuly !`)
    } catch (error) {
        console.error(`Database connection failed: ${error.message}`);
        throw error;
    }
}

export default connectDb;