import { Queue } from "bullmq";
import { config } from "./config";

const connection = {
  host: config.redis.host,
  port: config.redis.port,
};

const myQueue = new Queue("my-queue", { connection });

export { connection, myQueue };
