import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from "@/constants";
import Redis, { Callback } from "ioredis";
// export const redis = new Redis({
//   port: 6379,
//   host: REDIS_HOST,
//   password: REDIS_PASSWORD,
// });
// const RedisSocket_CORS = {
//   origin: "*",
//   methods: "GET, POST, PUT, DELETE, OPTIONS",
// };
// class RedisSocket extends Server {
//   private static io: RedisSocket;
//   private static socket: Socket;

//   constructor(httpServer: HttpServer) {
//     super(httpServer, {
//       cors: RedisSocket_CORS,
//       // adapter: createShardedAdapter(redis, redis.duplicate()),
//       adapter: createAdapter(redis, redis.duplicate()),
//     });
//   }

//   public static getInstance(httpServer?: HttpServer): RedisSocket {
//     if (!RedisSocket.io && httpServer) {
//       RedisSocket.io = new RedisSocket(httpServer);
//     }

//     return RedisSocket.io;
//   }
//   public static connect() {
//     const io = RedisSocket.io;
//     io.on("connection", (socket) => {
//       RedisSocket.socket = socket;
//       cLog(`socket connected: ${socket.id}`, "success");
//       socket.on("disconnect", () => {
//         cLog(`socket disconnected: ${socket.id}`, "success");
//       });
//     });
//   }
//   public static getSocketInstance() {
//     return RedisSocket.socket;
//   }
//   public static getInstances() {
//     return {
//       io: RedisSocket.getInstance(),
//       socket: RedisSocket.getSocketInstance(),
//     };
//   }
// }
// export default RedisSocket;
class IoRedis extends Redis {
  private static redis: Redis;

  constructor() {
    // super(REDIS_PATH as string);
    super({
      port: REDIS_PORT,
      host: REDIS_HOST,
      password: REDIS_PASSWORD,
    });
  }

  public static getInstance() {
    if (!IoRedis.redis) {
      try {
        IoRedis.redis = new IoRedis();
      } catch (error) {
        console.log(error);
      }
    }

    return IoRedis.redis;
  }
  public static getNewInstance() {
    return new IoRedis();
  }
  public static async publish(
    key: string | Buffer,
    message: string | Buffer,
    callback?: Callback<number>
  ) {
    const redis = IoRedis.getInstance();
    const msg = JSON.stringify(message);
    if (callback) {
      return await redis.publish(key, msg, callback);
    }
    return await redis.publish(key, msg);
  }
}

export default IoRedis;
