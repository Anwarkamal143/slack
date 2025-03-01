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
import morgan from "morgan";
import { subscribe } from "./redis/subscriber";
import SocketWithRedis from "./sockets";
const app = express();
// Catch uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1); // Restart process in a real app
});
app.use(
  cors({
    credentials: true,
    methods: "GET, POST, PUT, DELETE, OPTIONS",

    origin: ["http://localhost:3000", "http://localhost:4000"],
  })
);

app.use(morgan("dev"));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: "GET, POST, PUT, DELETE, OPTIONS",
//   },
// });
// io.on("connection", (socket) => {
//   // ...
//   console.log("connected client", socket.id);
//   app.set("socket", socket);
// });
// app.set("socketIo", io);
SocketWithRedis.getInstance(server);
// SocketWithRedis.connect();

subscribe();

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
// app.options("*", (_req, res) => {
//   console.log({ "*": "Star" });
//   res.set({
//     "Access-Control-Allow-Origin": "*", // Replace '*' with specific origin if needed
//     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//     "Access-Control-Allow-Headers": "Authorization, Content-Type",
//   });
//   res.status(200).end(); // End the response here
// });
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
