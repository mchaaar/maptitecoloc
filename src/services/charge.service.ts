import { ChargeRepository } from "../repositories/charge.repository";
import { ICharge } from "../databases/mongodb/charge.model";
import { CreateChargeDTO } from "../types/finance/dtos";
import { Types } from "mongoose";
import { ActionLogService } from "./actionLog.service";
import { ColocationRepository } from "../repositories/colocation.repository";

export class ChargeService {
  private chargeRepository: ChargeRepository;
  private colocationRepository: ColocationRepository;
  private actionLogService: ActionLogService;

  constructor() {
    this.chargeRepository = new ChargeRepository();
    this.colocationRepository = new ColocationRepository();
    this.actionLogService = new ActionLogService();
  }

  public async createCharge(
    userId: string,
    dto: CreateChargeDTO
  ): Promise<ICharge> {
    const colocation = await this.colocationRepository.findActiveById(dto.colocationId);
    if (!colocation) {
      throw new Error("Colocation not found or inactive");
    }

    const isCreator = colocation.createdBy.equals(userId);
    const isMember = colocation.members.some((m) => m.equals(userId));
    if (!isCreator && !isMember) {
      throw new Error("User not in colocation");
    }

    let sumSplit = 0;
    dto.split.forEach((part) => {
      sumSplit += part.amount;
    });
    if (sumSplit !== dto.totalAmount) {
      throw new Error("Split amounts do not sum up to the totalAmount");
    }

    const chargeData: Partial<ICharge> = {
      colocationId: new Types.ObjectId(dto.colocationId),
      title: dto.title,
      totalAmount: dto.totalAmount,
      paidBy: new Types.ObjectId(dto.paidBy),
      split: dto.split.map((s) => ({
        userId: new Types.ObjectId(s.userId),
        amount: s.amount,
      })),
      isActive: true,
    };

    const charge = await this.chargeRepository.createCharge(chargeData);

    await this.actionLogService.logAction({
      action: "CHARGE_CREATED",
      userId: new Types.ObjectId(userId),
      colocationId: colocation._id,
      payload: { chargeId: charge._id, title: dto.title },
    });

    return charge;
  }

  public async getColocationCharges(
    userId: string,
    colocationId: string
  ): Promise<ICharge[]> {
    const colocation = await this.colocationRepository.findActiveById(colocationId);
    if (!colocation) {
      throw new Error("Colocation not found");
    }
    const isCreator = colocation.createdBy.equals(userId);
    const isMember = colocation.members.some((m) => m.equals(userId));
    if (!isCreator && !isMember) {
      throw new Error("User not in colocation");
    }

    return this.chargeRepository.findByColocation(colocationId);
  }

  public async softDeleteCharge(
    userId: string,
    chargeId: string
  ): Promise<ICharge | null> {
    const charge = await this.chargeRepository.findById(chargeId);
    if (!charge || !charge.isActive) {
      return null;
    }

    const colocation = await this.colocationRepository.findActiveById(
      charge.colocationId.toString()
    );
    if (!colocation) {
      throw new Error("Colocation not found");
    }
    const isCreator = colocation.createdBy.equals(userId);
    const isMember = colocation.members.some((m) => m.equals(userId));
    if (!isCreator && !isMember) {
      throw new Error("User not in colocation");
    }

    const deletedCharge = await this.chargeRepository.softDeleteCharge(chargeId);

    if (deletedCharge) {
      await this.actionLogService.logAction({
        action: "CHARGE_DELETED",
        userId: new Types.ObjectId(userId),
        colocationId: colocation._id,
        payload: { chargeId: chargeId },
      });
    }

    return deletedCharge;
  }
}
