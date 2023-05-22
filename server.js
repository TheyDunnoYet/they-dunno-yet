const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const http = require("http");
const socketIo = require("socket.io");

const app = express();

// Connect Database
connectDB();

app.get("/", (req, res) => res.send("API Running"));

// Middleware
app.use(express.json());

// CORS Middleware
app.use(cors({ origin: "http://localhost:3000" }));

// Rate Limiting
app.enable("trust proxy");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

// Create server with http and express app
const server = http.createServer(app);

// Create Socket.IO instance attached to the server
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

// Make io accessible to our router
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/feed", require("./routes/feed"));
app.use("/api/topic", require("./routes/topic"));
app.use("/api/blockchain", require("./routes/blockchain"));
app.use("/api/marketplace", require("./routes/marketplace"));
app.use("/api/product", require("./routes/product"));
app.use("/api/tag", require("./routes/tag"));
app.use("/api/comment", require("./routes/comment"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.message);
  if (process.env.NODE_ENV === "development") {
    res.status(500).send({ message: err.message, stack: err.stack });
  } else {
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
