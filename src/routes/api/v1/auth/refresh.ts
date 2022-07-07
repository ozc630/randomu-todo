import { FastifyPluginAsync } from "fastify";
import { jwtService } from "../../../../common/services/jwt.service";
import { Prisma } from "../../../../common/services/prisma.service";
import { ErrorResponseSchema } from "../../../../schemas/index.schema";
import {
  RefreshDto,
  RefreshResponseSchema,
  RefreshSchema,
} from "../../../../schemas/auth.schema";

const refresh: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Body: RefreshDto }>(
    "/refresh",
    {
      schema: {
        tags: ["auth"],
        body: RefreshSchema,
        response: {
          200: RefreshResponseSchema,
          400: ErrorResponseSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { jwt } = fastify;
      try {
        await jwtService.verifyRefreshToken(request.body.refreshToken);
      } catch {
        return reply.unauthorized("Invalid refresh token");
      }

      const oldToken = await Prisma.refreshToken.findFirst({
        where: {
          token: request.body.refreshToken,
        },
      });

      if (!oldToken) {
        return reply.badRequest("Invalid refresh token");
      }

      const user = await Prisma.user.findFirst({
        where: {
          id: oldToken?.userId,
        },
      });

      if (!user) {
        return reply.notFound("User not found");
      }

      const newRefreshToken = await jwtService.signRefreshToken({
        id: user.id,
      });

      await Prisma.refreshToken.delete({
        where: {
          id: oldToken.id,
        },
      });

      await Prisma.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: user.id,
        },
      });

      return {
        ...user,
        accessToken: jwt.sign(
          { id: user.id },
          { expiresIn: process.env.ACCESS_TOKEN_TIME! }
        ),
        refreshToken: newRefreshToken,
      };
    }
  );
};

export default refresh;
