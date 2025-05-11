import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';  // Ensure this is correctly configured to connect to MongoDB
import toDoListRoutes from './routes/ToDoList.routes.js';  // Ensure these routes are working
import cors from 'cors';
import path from 'path';

// Ensure that you get the correct __dirname
const __dirname = path.resolve();

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Use routes for the todoList API
app.use("/todoList", toDoListRoutes);

// A simple route to check if the server is working


// In production, serve the React frontend build
if (process.env.NODE_ENV === "production") {
    // Ensure the dist directory is available after frontend build
    app.use(express.static(path.join(__dirname, "frontend", "dist")));

    // Serve the index.html file for all routes not defined by the backend
    app.get(/(.*)/, (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

// Start the server and connect to the database
app.listen(PORT, () => {
    connectDB();  // Make sure this function connects to MongoDB correctly
    console.log("Server started at PORT ", PORT);
});
