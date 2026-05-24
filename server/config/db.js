import mongoose from 'mongoose';

/**
 * Connects the application to the MongoDB Database.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
