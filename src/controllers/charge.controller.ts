import { RequestHandler } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ChargeService } from "../services/charge.service";
import { CreateChargeDTO, SoftDeleteChargeDTO } from "../types/finance/dtos";
import { ChargePresenter } from "../types/finance/presenters";

const chargeService = new ChargeService();

function formatValidationErrors(validationErrors: any[]): Array<{ field: string; message: string }> {
  return validationErrors.map((err) => {
    const field = err.property;
    const constraints = Object.values(err.constraints);
    return { field, message: constraints[0] as string };
  });
}

export const createCharge: RequestHandler = async (req, res, next) => {
  try {
    const dto = plainToInstance(CreateChargeDTO, req.body, {
      excludeExtraneousValues: true,
    });

    const errors = await validate(dto);
    if (errors.length > 0) {
      res.status(400).json({
        statusCode: 400,
        errorCode: "VALIDATION_ERROR",
        errMessage: "Validation failed",
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

    const charge = await chargeService.createCharge(userId, dto);

    const presenter = new ChargePresenter();
    presenter.id = charge._id.toString();
    presenter.colocationId = charge.colocationId.toString();
    presenter.title = charge.title;
    presenter.totalAmount = charge.totalAmount;
    presenter.paidBy = charge.paidBy.toString();
    presenter.split = charge.split.map((s) => ({
      userId: s.userId.toString(),
      amount: s.amount,
    }));
    presenter.isActive = charge.isActive;

    res.status(201).json(presenter);
    return;
  } catch (error) {
    next(error);
  }
};

export const listChargesForColocation: RequestHandler = async (req, res, next) => {
  try {
    const colocationId = req.params.colocationId;

    if (!req.user || !req.user._id) {
      res.status(401).json({
        statusCode: 401,
        errorCode: "UNAUTHORIZED",
        errMessage: "User not authenticated",
      });
      return;
    }

    const userId = req.user._id.toString();
    const charges = await chargeService.getColocationCharges(userId, colocationId);

    const results = charges.map((c) => {
      const presenter = new ChargePresenter();
      presenter.id = c._id.toString();
      presenter.colocationId = c.colocationId.toString();
      presenter.title = c.title;
      presenter.totalAmount = c.totalAmount;
      presenter.paidBy = c.paidBy.toString();
      presenter.split = c.split.map((part) => ({
        userId: part.userId.toString(),
        amount: part.amount,
      }));
      presenter.isActive = c.isActive;
      return presenter;
    });

    res.status(200).json(results);
    return;
  } catch (error) {
    next(error);
  }
};

export const softDeleteCharge: RequestHandler = async (req, res, next) => {
  try {
    const dto = plainToInstance(SoftDeleteChargeDTO, req.body, {
      excludeExtraneousValues: true,
    });

    const errors = await validate(dto);
    if (errors.length > 0) {
      res.status(400).json({
        statusCode: 400,
        errorCode: "VALIDATION_ERROR",
        errMessage: "Validation failed",
        errorFields: formatValidationErrors(errors),
      });
      return;
    }

    if (!req.user || !req.user._id) {
      res.status(401).json({
        statusCode: 401,
        errorCode: "UNAUTHORIZED",
        errMessage: "User not authenticated",
      });
      return;
    }

    const userId = req.user._id.toString();
    const deleted = await chargeService.softDeleteCharge(userId, dto.chargeId);

    if (!deleted) {
      res.status(404).json({
        statusCode: 404,
        errorCode: "CHARGE_NOT_FOUND",
        errMessage: "Charge not found or already inactive",
      });
      return;
    }

    res.status(200).json({
      message: "Charge soft-deleted successfully",
    });
    return;
  } catch (error) {
    next(error);
  }
};
