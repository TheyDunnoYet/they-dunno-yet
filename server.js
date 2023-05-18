require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();

// Connect Database
connectDB();

app.get("/", (req, res) => res.send("API Running"));

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/feed", require("./routes/feed"));
app.use("/api/topic", require("./routes/topic"));
app.use("/api/product", require("./routes/product"));
app.use("/api/tag", require("./routes/tag"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.message);

  if (process.env.NODE_ENV === "development") {
    // In development, send detailed error message
    res.status(500).send({ message: err.message, stack: err.stack });
  } else {
    // In production, send generic message and hide error details
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
