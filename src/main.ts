import Fastify from "fastify";
import dotenv from "dotenv";
import rareLimit from "@fastify/rate-limit";
import autoLoad from "@fastify/autoload";
import sensible from "@fastify/sensible";
import cors from "@fastify/cors";
import { join } from "path";
import { Prisma } from "./common/services/prisma.service";

dotenv.config();

async function main() {
  const fastify = Fastify({ logger: true });
  const PORT = +process.env.PORT!;

  fastify.register(cors);
  fastify.register(rareLimit, { max: 60, timeWindow: "1 minute" });
  fastify.register(autoLoad, { dir: join(__dirname, "plugins") });
  fastify.register(autoLoad, { dir: join(__dirname, "routes") });
  fastify.register(sensible);

  try {
    await fastify.listen({ port: PORT });
    console.log(`>> Server start on http://localhost:${PORT}`);
  } catch (e) {
    await Prisma.$disconnect();
    console.error(e);
    process.exit(1);
  }
}

main();
