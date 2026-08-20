import Fastify from "fastify";
import { Type } from "typebox";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

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

await fastify.listen({ port: 3000 });
