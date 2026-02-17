const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();

// Enhanced CORS middleware
app.use(cors({
    origin: function (origin, callback) {
        callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: false,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests explicitly
app.options("*", cors());

app.use(express.json());

const mongoUrl = process.env.CONNECTION_STRING || process.env.MONGODB_URL || "mongodb://localhost:27017/PoliceData";

mongoose.connect(mongoUrl)
    .then(() => console.log("MongoDB connected successfully!"))
    .catch((err) => console.log("MongoDB connection failed:", err));

// All auth routes
app.use("/api", authRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

