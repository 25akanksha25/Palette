// import mongoose from "mongoose";
// // In your server.js file or wherever you set up your Mongoose connection

// import "../models/bid.model.js";
// import "../models/city.model.js";

// const connectDB = async () => {
//   try {
//     const connectionInstance = await mongoose.connect(
//       ${process.env.MONGODB_URI}
//     );
//     console.log("Connected to DB", ${connectionInstance.connection.host});
//   } catch (error) {
//     console.error("err", error);

//     throw error;
//   }
// };

// export default connectDB;

import mongoose from "mongoose";
// Import your models to ensure they are loaded when the connection is established
import "../models/bid.model.js";
import "../models/city.model.js";
import dotenv from "dotenv";

dotenv.config({
  path:"./env"
})

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      "mongodb+srv://chopraakanksha10:Akankshamongo1212@cluster0.3wtem9z.mongodb.net/auction?retryWrites=true&w=majority&appName=Cluster0", // Fallback for local DB if the URI isn't set
      {
        useNewUrlParser: true, // Ensures MongoDB driver uses the new connection string parser
        useUnifiedTopology: true, // Ensures the MongoDB driver handles things correctly for newer versions
      }
    );
    console.log("Connected to DB:", connectionInstance.connection.host); // Logging the host of the connected DB
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message); // Improved error logging for debugging
    throw new Error("Failed to connect to MongoDB"); // Throw error to stop further execution
  }
};

export default connectDB;


// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     // Save the connection instance
//     const connectionInstance = await mongoose.connect(
//       'mongodb+srv://akritigarg2017:akritimongo1220@cluster0.t3fstno.mongodb.net/bids11?retryWrites=true&w=majority&appName=Cluster0',
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       }
//     );

//     // Log the host of the connected database
//     console.log('Connected to MongoDB:', connectionInstance.connection.host);
//   } catch (err) {
//     console.error('Error connecting to MongoDB:', err.message);
//     throw err; // Optionally re-throw the error for further handling
//   }
// };

// export default connectDB;