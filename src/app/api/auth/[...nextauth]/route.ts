import { handlers } from "@/server/auth";

// Endpoints do Auth.js: /api/auth/* (signin, callback, signout, session, csrf...).
export const { GET, POST } = handlers;
