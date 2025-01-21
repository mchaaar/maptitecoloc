import { IUser } from "../../databases/mongodb/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};
