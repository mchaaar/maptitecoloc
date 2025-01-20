import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../databases/mongodb/user.model";

export const authMiddleware = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      const err: any = new Error("No token provided");
      err.statusCode = 401;
      err.code = "NO_TOKEN";
      throw err;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      const err: any = new Error("Invalid token format");
      err.statusCode = 401;
      err.code = "INVALID_TOKEN_FORMAT";
      throw err;
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.userId);

    if (!user || !user.isActive) {
      const err: any = new Error("User not found or inactive");
      err.statusCode = 404;
      err.code = "USER_NOT_FOUND";
      throw err;
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
