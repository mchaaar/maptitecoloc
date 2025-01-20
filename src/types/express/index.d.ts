import { Request } from "express";
import { IUser } from "../../databases/mongodb/user.model";

export interface AuthRequest extends Request {
  user?: IUser;
}