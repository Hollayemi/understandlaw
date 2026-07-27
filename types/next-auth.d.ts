import type { DefaultSession } from "next-auth";

export type UserRole = "citizen" | "lawyer" | "admin";
export type AuthActor = "user" | "admin";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    role?: UserRole;
    actor?: AuthActor;
    error?: "OAuthBackendError";
    user: {
      id?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: UserRole;
    actor?: AuthActor;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    role?: UserRole;
    actor?: AuthActor;
    userId?: string;
    error?: "OAuthBackendError";
  }
}
