import { PaymentRepository } from "../repositories/payment.repository";
import { IPayment } from "../databases/mongodb/payment.model";
import { CreatePaymentDTO } from "../types/finance/dtos";
import { Types } from "mongoose";
import { ColocationRepository } from "../repositories/colocation.repository";
import { ActionLogService } from "./actionLog.service";

export class PaymentService {
  private paymentRepository: PaymentRepository;
  private colocationRepository: ColocationRepository;
  private actionLogService: ActionLogService;

  constructor() {
    this.paymentRepository = new PaymentRepository();
    this.colocationRepository = new ColocationRepository();
    this.actionLogService = new ActionLogService();
  }

  public async createPayment(
    userId: string,
    dto: CreatePaymentDTO
  ): Promise<IPayment> {
    const colocation = await this.colocationRepository.findActiveById(dto.colocationId);
    if (!colocation) {
      throw new Error("Colocation not found or inactive");
    }

    const isCreator = colocation.createdBy.equals(userId);
    const isMember = colocation.members.some((m) => m.equals(userId));
    if (!isCreator && !isMember) {
      throw new Error("User not in colocation");
    }

    if (dto.fromUser !== userId) {
      throw new Error("Invalid fromUser");
    }

    const paymentData: Partial<IPayment> = {
      colocationId: new Types.ObjectId(dto.colocationId),
      fromUser: new Types.ObjectId(dto.fromUser),
      toUser: new Types.ObjectId(dto.toUser),
      amount: dto.amount,
      note: dto.note,
    };

    const payment = await this.paymentRepository.createPayment(paymentData);

    console.log(`Payment of ${dto.amount} from user ${dto.fromUser} to ${dto.toUser}`);

    await this.actionLogService.logAction({
      action: "PAYMENT_CREATED",
      userId: new Types.ObjectId(userId),
      colocationId: colocation._id,
      payload: { paymentId: payment._id, amount: dto.amount },
    });

    return payment;
  }

  public async getColocationPayments(
    userId: string,
    colocationId: string
  ): Promise<IPayment[]> {
    const colocation = await this.colocationRepository.findActiveById(colocationId);
    if (!colocation) {
      throw new Error("Colocation not found or inactive");
    }

    const isCreator = colocation.createdBy.equals(userId);
    const isMember = colocation.members.some((m) => m.equals(userId));
    if (!isCreator && !isMember) {
      throw new Error("User not in colocation");
    }

    return this.paymentRepository.findByColocation(colocationId);
  }
}
