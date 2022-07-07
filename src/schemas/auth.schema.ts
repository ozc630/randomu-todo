import { Static, Type } from "@sinclair/typebox";

export const AuthorizationSchema = Type.Object({
  Authorization: Type.String({
    description: "Bearer {your_token}",
  }),
});

export const UserCore = {
  id: Type.Number(),
  email: Type.String({ format: "email" }),
  name: Type.String(),
};

export const RegisterSchema = Type.Object({
  email: Type.String({ format: "email" }),
  name: Type.String({ maxLength: 12, minLength: 11 }),
  password: Type.String({ minLength: 6, maxLength: 256 }),
});

export type RegisterDto = Static<typeof RegisterSchema>;

export const LoginSchema = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String({ minLength: 6, maxLength: 256 }),
});

export type LoginDto = Static<typeof LoginSchema>;

export const LoginResponseSchema = Type.Object({
  ...UserCore,
  accessToken: Type.String(),
  refreshToken: Type.String(),
});

export const RefreshSchema = Type.Object({
  refreshToken: Type.String(),
});

export const RefreshResponseSchema = Type.Object({
  ...UserCore,
  accessToken: Type.String(),
  refreshToken: Type.String(),
});

export const RegisterResponseSchema = Type.Object({
  ...UserCore,
});

export type RefreshDto = Static<typeof RefreshSchema>;
