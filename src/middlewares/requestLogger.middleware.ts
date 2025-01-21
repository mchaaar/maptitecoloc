import { Request, Response, NextFunction } from "express";
import { IUser } from "../databases/mongodb/user.model";
import { Types } from "mongoose";
import { ActionLogService } from "../services/actionLog.service";

type RequestWithUser = Request & { user?: IUser };

const actionLogService = new ActionLogService();

export const requestLogger = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    await actionLogService.logAction({
      userId: userId ? new Types.ObjectId(userId) : undefined,
    });
  } catch (error) {
    console.error("Request logging failed:", error);
  }
  next();
};
