import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    id_token?: string; // Add id_token as an optional property
  }
}