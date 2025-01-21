import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ColocationService } from "../services/colocation.service";
import {
  CreateColocationDTO,
  AddMemberDTO,
  TransferOwnershipDTO,
} from "../types/colocation/dtos";
import { ColocationPresenter } from "../types/colocation/presenters";
import { IUser } from "../databases/mongodb/user.model";

const colocationService = new ColocationService();

function formatValidationErrors(validationErrors: any[]): Array<{ field: string; message: string }> {
  return validationErrors.map((err) => {
    const field = err.property;
    const constraints = Object.values(err.constraints);
    return { field, message: constraints[0] as string };
  });
}

type AuthRequest = Request & { user?: IUser };

export const createColocation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const dto = plainToInstance(CreateColocationDTO, req.body, {
      excludeExtraneousValues: true,
    });
    const errors = await validate(dto);
    if (errors.length > 0) {
      res.status(400).json({
        statusCode: 400,
        errorCode: "VALIDATION_ERROR",
        errMessage: "Validation failed",
        form: "createColocation",
        errorFields: formatValidationErrors(errors),
      });
      return;
    }

    const userId = req.user?._id.toString();
    if (!userId) {
      res.status(401).json({
        statusCode: 401,
        errorCode: "UNAUTHORIZED",
        errMessage: "User not authenticated",
      });
      return;
    }

    const colocation = await colocationService.createColocation(userId, dto);

    const presenter = new ColocationPresenter();
    presenter.id = colocation._id.toString();
    presenter.name = colocation.name;
    presenter.location = colocation.location;
    presenter.surface = colocation.surface;
    presenter.roomCount = colocation.roomCount;
    presenter.agency = colocation.agency;
    presenter.owner = colocation.owner;
    presenter.members = colocation.members.map((m) => m.toString());
    presenter.createdBy = colocation.createdBy.toString();
    presenter.isActive = colocation.isActive;

    res.status(201).json(presenter);
    return;
  } catch (error) {
    next(error);
  }
};

export const listUserColocations = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id.toString();
    if (!userId) {
      res.status(401).json({
        statusCode: 401,
        errorCode: "UNAUTHORIZED",
        errMessage: "User not authenticated",
      });
      return;
    }

    const colocations = await colocationService.getUserColocations(userId);

    const results = colocations.map((coloc) => {
      const p = new ColocationPresenter();
      p.id = coloc._id.toString();
      p.name = coloc.name;
      p.location = coloc.location;
      p.surface = coloc.surface;
      p.roomCount = coloc.roomCount;
      p.agency = coloc.agency;
      p.owner = coloc.owner;
      p.members = coloc.members.map((m) => m.toString());
      p.createdBy = coloc.createdBy.toString();
      p.isActive = coloc.isActive;
      return p;
    });

    res.status(200).json(results);
    return;
  } catch (error) {
    next(error);
  }
};

export const getColocationDetails = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id.toString();
    if (!userId) {
      res.status(401).json({
        statusCode: 401,
        errorCode: "UNAUTHORIZED",
        errMessage: "User not authenticated",
      });
      return;
    }

    const colocationId = req.params.id;
    const colocation = await colocationService.getColocationDetails(userId, colocationId);

    if (!colocation) {
      res.status(404).json({
        statusCode: 404,
        errorCode: "COLOCATION_NOT_FOUND",
        errMessage: "Colocation not found or no access.",
      });
      return;
    }

    const presenter = new ColocationPresenter();
    presenter.id = colocation._id.toString();
    presenter.name = colocation.name;
    presenter.location = colocation.location;
    presenter.surface = colocation.surface;
    presenter.roomCount = colocation.roomCount;
    presenter.agency = colocation.agency;
    presenter.owner = colocation.owner;
    presenter.members = colocation.members.map((m) => m.toString());
    presenter.createdBy = colocation.createdBy.toString();
    presenter.isActive = colocation.isActive;

    res.status(200).json(presenter);
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteColocation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id.toString();
    if (!userId) {
      res.status(401).json({
        statusCode: 401,
        errorCode: "UNAUTHORIZED",
        errMessage: "User not authenticated",
      });
      return;
    }

    const colocationId = req.params.id;
    const result = await colocationService.deleteColocation(userId, colocationId);

    if (!result) {
      res.status(404).json({
        statusCode: 404,
        errorCode: "COLOCATION_NOT_FOUND",
        errMessage: "Unable to delete colocation or not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Colocation successfully soft-deleted",
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const addMemberToColocation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const dto = plainToInstance(AddMemberDTO, req.body, { excludeExtraneousValues: true });
    const errors = await validate(dto);
    if (errors.length > 0) {
      res.status(400).json({
        statusCode: 400,
        errorCode: "VALIDATION_ERROR",
        errMessage: "Validation failed",
        form: "addMember",
        errorFields: formatValidationErrors(errors),
      });
      return;
    }

    const userId = req.user?._id.toString();
    if (!userId) {
      res.status(401).json({
        statusCode: 401,
        errorCode: "UNAUTHORIZED",
        errMessage: "User not authenticated",
      });
      return;
    }

    const updated = await colocationService.addMember(userId, dto);

    if (!updated) {
      res.status(404).json({
        statusCode: 404,
        errorCode: "COLOCATION_NOT_FOUND",
        errMessage: "Colocation not found or not active",
      });
      return;
    }

    res.status(200).json({
      message: "Member added successfully",
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const removeMemberFromColocation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const dto = plainToInstance(AddMemberDTO, req.body, { excludeExtraneousValues: true });
    const errors = await validate(dto);
    if (errors.length > 0) {
      res.status(400).json({
        statusCode: 400,
        errorCode: "VALIDATION_ERROR",
        errMessage: "Validation failed",
        form: "removeMember",
        errorFields: formatValidationErrors(errors),
      });
      return;
    }

    const userId = req.user?._id.toString();
    if (!userId) {
      res.status(401).json({
        statusCode: 401,
        errorCode: "UNAUTHORIZED",
        errMessage: "User not authenticated",
      });
      return;
    }

    const updated = await colocationService.removeMember(userId, dto);

    if (!updated) {
      res.status(404).json({
        statusCode: 404,
        errorCode: "COLOCATION_NOT_FOUND",
        errMessage: "Colocation not found or not active",
      });
      return;
    }

    res.status(200).json({
      message: "Member removed successfully",
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const transferOwnership = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const dto = plainToInstance(TransferOwnershipDTO, req.body, {
      excludeExtraneousValues: true,
    });
    const errors = await validate(dto);
    if (errors.length > 0) {
      res.status(400).json({
        statusCode: 400,
        errorCode: "VALIDATION_ERROR",
        errMessage: "Validation failed",
        form: "transferColocation",
        errorFields: formatValidationErrors(errors),
      });
      return;
    }

    const userId = req.user?._id.toString();
    if (!userId) {
      res.status(401).json({
        statusCode: 401,
        errorCode: "UNAUTHORIZED",
        errMessage: "User not authenticated",
      });
      return;
    }

    const updated = await colocationService.transferOwnership(
      userId,
      dto.colocationId,
      dto.newOwnerId
    );

    if (!updated) {
      res.status(404).json({
        statusCode: 404,
        errorCode: "COLOCATION_NOT_FOUND",
        errMessage: "Colocation not found or not active",
      });
      return;
    }

    res.status(200).json({
      message: "Ownership transferred successfully",
    });
    return;
  } catch (error) {
    next(error);
  }
};
