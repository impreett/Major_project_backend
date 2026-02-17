const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes"); // YOU FORGOT THIS

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.CONNECTION_STRING)
    .then(() => console.log("MongoDB connected successfully!"))
    .catch((err) => console.log("MongoDB connection failed:", err));

// All auth routes
app.use("/api", authRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
