const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const chatRoutes = require("./routes/chatRoutes");
const cors = require("cors");
const http = require("http");
const setupSocketIO = require("./socket/socketManager");

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://study-portal-owioe519m-syed-md-farhan-e-azams-projects.vercel.app",
  "https://study-portal-tan.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("CORS Origin:", origin); // debug log
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.error("CORS Rejected Origin:", origin); // debug log
      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/chat", chatRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const server = http.createServer(app);

// Setup Socket.IO
setupSocketIO(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
