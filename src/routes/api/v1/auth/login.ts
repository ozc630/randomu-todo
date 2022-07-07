import { compare } from "bcryptjs";
import { FastifyPluginAsync } from "fastify";
import { jwtService } from "../../../../common/services/jwt.service";
import { Prisma } from "../../../../common/services/prisma.service";
import {
  LoginDto,
  LoginResponseSchema,
  LoginSchema,
} from "../../../../schemas/auth.schema";
import { ErrorResponseSchema } from "../../../../schemas/index.schema";

const login: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Body: LoginDto }>(
    "/login",
    {
      schema: {
        tags: ["auth"],
        body: LoginSchema,
        response: {
          200: LoginResponseSchema,
          403: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { body: dto } = request;
      const { jwt } = fastify;

      const user = await Prisma.user.findFirst({
        where: {
          email: dto.email,
        },
      });

      if (user && (await compare(dto.password, user.password))) {
        const refreshToken = await jwtService.signRefreshToken({ id: user.id });

        await Prisma.refreshToken.create({
          data: {
            token: refreshToken,
            userId: user.id,
          },
        });

        return {
          ...user,
          accessToken: jwt.sign(
            { id: user.id },
            { expiresIn: process.env.ACCESS_TOKEN_TIME! }
          ),
          refreshToken,
        };
      }

      return reply.forbidden();
    }
  );
};

export default login;
