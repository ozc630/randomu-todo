import { Type } from "@sinclair/typebox";

export const OkCoreSchema = {
  message: Type.String(),
};

export const ErrorResponseSchema = Type.Object({
  statusCode: Type.Number(),
  message: Type.String(),
});

export const OkResponseSchema = Type.Object(OkCoreSchema);
