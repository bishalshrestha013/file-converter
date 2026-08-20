import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(import.meta.dirname, ".env") });

interface Config {
  port: number;
}

export const config: Config = {
  port: parseInt(process.env.PORT as string) || 3000,
};
