import { hash } from "bcryptjs";
import { FastifyPluginAsync } from "fastify";
import { Prisma } from "../../../../common/services/prisma.service";
import { ErrorResponseSchema } from "../../../../schemas/index.schema";
import {
  RegisterDto,
  RegisterResponseSchema,
  RegisterSchema,
} from "../../../../schemas/auth.schema";

const register: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Body: RegisterDto }>(
    "/register",
    {
      schema: {
        tags: ["auth"],
        body: RegisterSchema,
        response: {
          201: RegisterResponseSchema,
          403: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { body: dto } = request;
      const hashPassword = await hash(dto.password, +process.env.SALT!);

      try {
        const newUser = await Prisma.user.create({
          data: { ...dto, password: hashPassword },
        });

        return reply.status(201).send(newUser);
      } catch (error) {
        return reply.forbidden("User with this email is exist");
      }
    }
  );
};

export default register;
