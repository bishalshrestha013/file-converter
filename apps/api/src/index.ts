import Fastify from "fastify";
import { Type } from "typebox";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { FastifyAdapter } from "@bull-board/fastify";
import { config } from "./config.ts";
import { myQueue } from "./queue.ts";
import { BULL_BOARD_BASE_PATH } from "./constants.ts";

const fastify = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

fastify.get(
  "/",
  {
    schema: {
      querystring: Type.Object({
        name: Type.Optional(Type.String()),
      }),
      response: {
        200: Type.Object({
          hello: Type.String(),
        }),
      },
    },
  },
  async (request) => {
    return { hello: request.query.name ?? "world" };
  },
);

fastify.post(
  "/file-process",
  {
    schema: {
      body: Type.Object({
        name: Type.String(),
      }),
      response: {
        200: Type.Object({
          message: Type.String(),
          jobId: Type.String(),
        }),
      },
    },
  },
  async (request, reply) => {
    const job = await myQueue.add(
      "file-processing",
      {
        name: request.body.name,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
      },
    );

    return reply.status(200).send({
      message: "File is added to the queue for processing",
      jobId: job.id as string,
    });
  },
);

const bullBoardServerAdapter = new FastifyAdapter();

createBullBoard({
  queues: [new BullMQAdapter(myQueue)],
  serverAdapter: bullBoardServerAdapter,
});

bullBoardServerAdapter.setBasePath(BULL_BOARD_BASE_PATH);

await fastify.register(bullBoardServerAdapter.registerPlugin(), {
  prefix: BULL_BOARD_BASE_PATH,
});

await fastify.listen({ port: config.port });
