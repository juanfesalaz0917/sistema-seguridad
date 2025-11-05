import { User } from "./User";

export interface Session {
  id?: string;
  token: string;
  startAt: Date;
  endAt?: Date;
  ipAddress?: string;
  state?: "ACTIVE" | "EXPIRED" | "CLOSED";
  user?: User;
}