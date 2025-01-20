import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { UserService } from "../services/user.service";
import { UserToCreateDTO, UserLoginDTO } from "../types/user/dtos";
import { UserPresenter } from "../types/user/presenters";
import { IUser } from "../databases/mongodb/user.model";
import { UserModel } from "../databases/mongodb/user.model";

const userService = new UserService();

interface AuthRequest extends Request {
  user?: IUser;
}

function formatValidationErrors(validationErrors: any[]) {
  return validationErrors.map((err) => {
    const field = err.property;
    const constraints = Object.values(err.constraints);
    return { field, message: constraints[0] };
  });
}

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userToCreateDTO = plainToInstance(UserToCreateDTO, req.body, {
      excludeExtraneousValues: true,
    });
    const dtoErrors = await validate(userToCreateDTO);
    if (dtoErrors.length > 0) {
      const errorResponse = {
        statusCode: 400,
        errorCode: "VALIDATION_ERROR",
        errMessage: "Validation failed",
        form: "register",
        errorFields: formatValidationErrors(dtoErrors),
      };
      res.status(400).json(errorResponse);
      return;
    }

    const user = await userService.registerUser(userToCreateDTO);

    const { accessToken, refreshToken } = userService.generateTokens(user);

    const userPresenter = plainToInstance(
      UserPresenter,
      {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        age: user.age,
        photo: user.photo,
        isActive: user.isActive,
      },
      { excludeExtraneousValues: true }
    );

    res.status(201).json({
      user: userPresenter,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const loginDTO = plainToInstance(UserLoginDTO, req.body, {
      excludeExtraneousValues: true,
    });
    const dtoErrors = await validate(loginDTO);
    if (dtoErrors.length > 0) {
      const errorResponse = {
        statusCode: 400,
        errorCode: "VALIDATION_ERROR",
        errMessage: "Validation failed",
        form: "login",
        errorFields: formatValidationErrors(dtoErrors),
      };
      res.status(400).json(errorResponse);
      return;
    }

    const user = await userService.findByEmail(loginDTO.email);
    if (!user) {
      const err: any = new Error("Invalid email or password");
      err.statusCode = 401;
      err.code = "INVALID_CREDENTIALS";
      throw err;
    }

    const isMatch = await userService.validateUserPassword(
      loginDTO.password,
      user.passwordHash
    );
    if (!isMatch) {
      const err: any = new Error("Invalid email or password");
      err.statusCode = 401;
      err.code = "INVALID_CREDENTIALS";
      throw err;
    }

    const { accessToken, refreshToken } = userService.generateTokens(user);

    const userPresenter = plainToInstance(
      UserPresenter,
      {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        age: user.age,
        photo: user.photo,
        isActive: user.isActive,
      },
      { excludeExtraneousValues: true }
    );

    res.status(200).json({
      user: userPresenter,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      const err: any = new Error("Refresh token is required");
      err.statusCode = 400;
      err.code = "TOKEN_REQUIRED";
      throw err;
    }

    const payload = userService.verifyRefreshToken(refreshToken);
    if (!payload || !payload.userId) {
      const err: any = new Error("Invalid refresh token");
      err.statusCode = 401;
      err.code = "INVALID_TOKEN";
      throw err;
    }

    const user = await UserModel.findById(payload.userId);
    if (!user || !user.isActive) {
      const err: any = new Error("User not found or inactive");
      err.statusCode = 404;
      err.code = "USER_NOT_FOUND";
      throw err;
    }

    const { accessToken, refreshToken: newRefreshToken } =
      userService.generateTokens(user);

    res.status(200).json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      const err: any = new Error("User not authenticated");
      err.statusCode = 401;
      err.code = "UNAUTHORIZED";
      throw err;
    }

    const user = req.user;
    const userPresenter = plainToInstance(
      UserPresenter,
      {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        age: user.age,
        photo: user.photo,
        isActive: user.isActive,
      },
      { excludeExtraneousValues: true }
    );

    res.status(200).json(userPresenter);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      const err: any = new Error("User not authenticated");
      err.statusCode = 401;
      err.code = "UNAUTHORIZED";
      throw err;
    }

    await userService.deleteUser(req.user._id.toString());

    res.status(200).json({
      message: "User successfully deleted (soft delete).",
    });
  } catch (error) {
    next(error);
  }
};
