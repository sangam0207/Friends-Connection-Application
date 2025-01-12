import express from "express";
import { ENV } from "./configs/constant.js";
import cors from "cors";
import helmet from "helmet";
import "./configs/db.config.js";
import { Server } from "socket.io"; 
import http from "http"; 
import "./configs/db.config.js"; 
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";

const app = express();
let io;
const server = http.createServer(app); 
io = new Server(server, {
  cors: {
    origin: true, 
    credentials: true,
  },
});

app.use(cors({ credentials: true, origin: true }));
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(express.json());
app.use((req, res, next) => {
  req.io = io; 
  next();
});
// Routes
app.use("/v1/auth", authRouter);
app.use("/v1/user", userRouter);

app.get("/", (req, res) => {
  res.send("Testing");
});


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

 
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


server.listen(ENV.APP_PORT, () => {
  if (ENV.APP_ENV === "development") {
    console.log(`Listening to the port ${ENV.APP_PORT}`);
  }
});
