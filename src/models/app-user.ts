import { User } from "firebase/auth";

export type AppUser = User & { isAdmin?: boolean };
