import { ISocket } from "@/@types/socket";
import { cLog } from "@/db/consoleLogs";
import IoRedis from "@/redis";
import { createRedisKey, verifyJwt } from "@/utils";
import { createAdapter } from "@socket.io/redis-adapter";
import { Express } from "express";
import { Server as HttpServer } from "http";
import { Server } from "socket.io";
// const WEBSOCKET_CORS = {
//   origin: "*",
//   methods: "GET, POST, PUT, DELETE, OPTIONS",
// };
export function useSockets(app: Express, server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: "GET, POST, PUT, DELETE, OPTIONS",
    },
  });
  io.on("connection", (socket) => {
    // ...
    console.log("connected client", socket.id);
    app.set("socket", socket);
  });
  app.set("socketIo", io);
}

const RedisSocket_CORS = {
  origin: "*",
  methods: "GET, POST, PUT, DELETE, OPTIONS",
};
class RedisSocket {
  private io!: Server;
  private socket!: ISocket;

  constructor() {}

  public getInstance(httpServer?: HttpServer): Server {
    if (!this.io && httpServer) {
      const pubClient = IoRedis.getInstance();
      const subClient = pubClient.duplicate();
      this.io = new Server(httpServer, {
        cors: RedisSocket_CORS,
        // adapter: createShardedAdapter(redis, redis.duplicate()),
        adapter: createAdapter(pubClient, subClient),
      });
      this.connect(this.io);
    }

    return this.io;
  }
  public authenticateConnection(io: Server) {
    // Middleware to authenticate Socket.io connections
    io.use(async (socket: ISocket, next) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication error: Token required"));
      }
      try {
        const decoded = await verifyJwt(token);
        if (!decoded) {
          return next(new Error("Authentication error: Invalid token"));
        }
        socket.user = decoded?.data; // Attach user data to socket

        next();
      } catch (error) {
        next(new Error("Authentication error: Invalid token"));
      }
    });
  }
  public connect(io: Server) {
    this.authenticateConnection(io);
    io.on("connection", async (socket: ISocket) => {
      // // this.socket = socket;
      const pubClient = IoRedis.getInstance();
      await pubClient.set(
        createRedisKey(`socket:${socket.user?.id}`),
        socket.id
      );
      cLog(
        `socket connected: ${socket.id}, with User: ${socket.user?.id}`,
        "success"
      );
      socket.on("disconnect", () => {
        pubClient.del(createRedisKey(`socket:${socket.user?.id}`));
        cLog(
          `socket disconnected: ${socket.id} , with User: ${socket.user?.id}`,
          "success"
        );
      });
    });
  }
  public getSocketInstance() {
    return this.socket;
  }
  public getInstances() {
    const pubClient = IoRedis.getInstance();
    return {
      io: this.io,
      getSocket: async (userId?: string) => {
        if (!userId) {
          return undefined;
        }
        try {
          const socketId = await pubClient.get(
            createRedisKey(`socket:${userId}`)
          );
          if (!socketId) {
            return undefined;
          }
          return this.io.sockets.sockets.get(socketId) as ISocket;
        } catch (error) {
          return undefined;
        }
      },
    };
  }
}
export default new RedisSocket();
