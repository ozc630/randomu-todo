import { FastifyPluginAsync } from "fastify";
import { Prisma } from "../../../../common/services/prisma.service";
import {
  ErrorResponseSchema,
  OkResponseSchema,
} from "../../../../schemas/index.schema";
import { AuthorizationSchema } from "../../../../schemas/auth.schema";

const register: FastifyPluginAsync = async (fastify) => {
  fastify.delete(
    "/logout",
    {
      preHandler: fastify.authenticate,
      schema: {
        tags: ["auth"],
        headers: AuthorizationSchema,
        response: {
          200: OkResponseSchema,
          401: ErrorResponseSchema,
        },
      },
    },
    async (request) => {
      const { id } = request.user;

      await Prisma.refreshToken.deleteMany({
        where: {
          userId: id,
        },
      });

      return {
        message: "Success logout",
      };
    }
  );
};

export default register;
