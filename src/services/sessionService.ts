import { BaseService } from "./baseService";
import { Session } from "../models/Session";

export class SessionService extends BaseService<Session> {}
export const sessionService = new SessionService();