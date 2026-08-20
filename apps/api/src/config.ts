import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(import.meta.dirname, ".env") });

interface Config {
  port: number;
  redis: {
    port: number;
    host: string;
  };
}

export const config: Config = {
  port: parseInt(process.env.PORT as string) || 3000,
  redis: {
    port: parseInt(process.env.REDIS_PORT as string) || 6379,
    host: process.env.REDIS_HOST || "localhost",
  },
};
