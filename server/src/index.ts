// @ts-ignore
import "dotenv/config";

import { BASE_API_PATH, PORT } from "@/constants";
import { errorHandler } from "@/controllers/error.controller";
import router from "@/routes";
import AppError from "@/utils/appError";
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
const app = express();
// Catch uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1); // Restart process in a real app
});
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:4000"],
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  // ...
  console.log("connected client", socket.id);
});
app.set("socketIo", io);
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use(BASE_API_PATH, router);
app.all("*", (req, _, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorHandler);

// Catch unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
export default app;
