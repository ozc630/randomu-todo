import { FastifyPluginAsync } from "fastify";
import { Prisma } from "../../../../common/services/prisma.service";
import { AuthorizationSchema } from "../../../../schemas/auth.schema";
import {
  ErrorResponseSchema,
  OkResponseSchema,
} from "../../../../schemas/index.schema";
import {
  CreateTodoDto,
  CreateTodoResponseSchema,
  CreateTodoSchema,
  FindAllTodosResponseSchema,
  FindOneTodoResponseSchema,
  UpdateTodoDto,
  UpdateTodoResponseSchema,
  UpdateTodoSchema,
} from "../../../../schemas/todos.schema";

const todos: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Body: CreateTodoDto }>(
    "/",
    {
      preHandler: fastify.authenticate,
      schema: {
        body: CreateTodoSchema,
        tags: ["todos"],
        headers: AuthorizationSchema,
        response: {
          201: CreateTodoResponseSchema,
          403: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.user;
      const { body: dto } = request;

      const newTodo = await Prisma.todo.create({
        data: {
          ...dto,
          userId: id,
        },
      });

      return reply.status(201).send(newTodo);
    }
  );

  fastify.get(
    "/:todoId",
    {
      preHandler: fastify.authenticate,
      schema: {
        tags: ["todos"],
        headers: AuthorizationSchema,
        response: {
          200: FindOneTodoResponseSchema,
          403: ErrorResponseSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.user;
      const { todoId } = request.params as { todoId: string };

      const todo = await Prisma.todo.findFirst({
        where: {
          userId: id,
          id: +todoId,
        },
      });

      if (!todo) return reply.notFound("No one todo not found");

      return todo;
    }
  );

  fastify.get(
    "/",
    {
      preHandler: fastify.authenticate,
      schema: {
        tags: ["todos"],
        headers: AuthorizationSchema,
        response: {
          200: FindAllTodosResponseSchema,
          403: ErrorResponseSchema,
        },
      },
    },
    async (request) => {
      const { id } = request.user;
      return await Prisma.todo.findMany({
        where: {
          userId: id,
        },
      });
    }
  );

  fastify.put<{ Body: UpdateTodoDto }>(
    "/:todoId",
    {
      preHandler: fastify.authenticate,
      schema: {
        body: UpdateTodoSchema,
        tags: ["todos"],
        headers: AuthorizationSchema,
        response: {
          200: UpdateTodoResponseSchema,
          404: ErrorResponseSchema,
          403: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.user;
      const { todoId } = request.params as { todoId: string };
      const { body: dto } = request;

      const todo = await Prisma.todo.findFirst({
        where: {
          userId: id,
          id: +todoId,
        },
      });

      if (!todo) return reply.notFound();

      return await Prisma.todo.update({
        where: { id: +todoId },
        data: {
          ...todo,
          ...dto,
        },
      });
    }
  );

  fastify.delete(
    "/:todoId",
    {
      preHandler: fastify.authenticate,
      schema: {
        tags: ["todos"],
        headers: AuthorizationSchema,
        response: {
          200: OkResponseSchema,
          403: ErrorResponseSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.user;
      const { todoId } = request.params as { todoId: string };

      const todo = await Prisma.todo.findFirst({
        where: {
          userId: id,
          id: +todoId,
        },
      });

      if (!todo) return reply.notFound("No one todo not found");

      await Prisma.todo.delete({
        where: {
          id: +todoId,
        },
      });

      return {
        message: "Todo removed success",
      };
    }
  );
};

export default todos;
