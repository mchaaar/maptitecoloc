import { RequestHandler } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { PaymentService } from "../services/payment.service";
import { CreatePaymentDTO } from "../types/finance/dtos";
import { PaymentPresenter } from "../types/finance/presenters";

const paymentService = new PaymentService();

function formatValidationErrors(validationErrors: any[]): Array<{ field: string; message: string }> {
  return validationErrors.map((err) => {
    const field = err.property;
    const constraints = Object.values(err.constraints);
    return { field, message: constraints[0] as string };
  });
}

export const createPayment: RequestHandler = async (req, res, next) => {
  try {
    const dto = plainToInstance(CreatePaymentDTO, req.body, {
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
    }
    const userId = req.user?._id.toString();
    if (!userId) {
      res.status(401).json({
        statusCode: 401,
        errorCode: "UNAUTHORIZED",
        errMessage: "User not authenticated",
      });
    }

    const payment = await paymentService.createPayment(userId, dto);

    const presenter = new PaymentPresenter();
    presenter.id = payment._id.toString();
    presenter.colocationId = payment.colocationId.toString();
    presenter.fromUser = payment.fromUser.toString();
    presenter.toUser = payment.toUser.toString();
    presenter.amount = payment.amount;
    presenter.note = payment.note || null;

    res.status(201).json(presenter);
  } catch (error) {
    next(error);
  }
};

export const listPaymentsForColocation: RequestHandler = async (req, res, next) => {
  try {
    const colocationId = req.params.colocationId;

    const userId = req.user?._id.toString();
    if (!userId) {
      res.status(401).json({
        statusCode: 401,
        errorCode: "UNAUTHORIZED",
        errMessage: "User not authenticated",
      });
    }

    const payments = await paymentService.getColocationPayments(userId, colocationId);

    const results = payments.map((p) => {
      const presenter = new PaymentPresenter();
      presenter.id = p._id.toString();
      presenter.colocationId = p.colocationId.toString();
      presenter.fromUser = p.fromUser.toString();
      presenter.toUser = p.toUser.toString();
      presenter.amount = p.amount;
      presenter.note = p.note || null;
      return presenter;
    });

    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};
