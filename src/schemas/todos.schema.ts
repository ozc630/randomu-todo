import { Static, Type } from "@sinclair/typebox";

export const TodoCore = {
  id: Type.Number(),
  title: Type.String(),
  content: Type.String(),
  isCompleted: Type.Boolean(),
  userId: Type.Number(),
};

export const CreateTodoSchema = Type.Object({
  title: Type.String(),
  content: Type.String(),
});

export const CreateTodoResponseSchema = Type.Object(TodoCore);

export type CreateTodoDto = Static<typeof CreateTodoSchema>;

export const FindOneTodoResponseSchema = Type.Object(TodoCore);

export const FindAllTodosResponseSchema = Type.Array(FindOneTodoResponseSchema);

export const UpdateTodoSchema = Type.Object({
  title: Type.String(),
  content: Type.String(),
  isCompleted: Type.Boolean(),
});

export type UpdateTodoDto = Static<typeof UpdateTodoSchema>;

export const UpdateTodoResponseSchema = FindOneTodoResponseSchema;
