import { ChargeModel, ICharge } from "../databases/mongodb/charge.model";
import { Types } from "mongoose";

export class ChargeRepository {
  public async createCharge(data: Partial<ICharge>): Promise<ICharge> {
    const charge = new ChargeModel(data);
    return charge.save();
  }

  public async findById(id: string): Promise<ICharge | null> {
    return ChargeModel.findById(id);
  }

  public async findByColocation(colocationId: string): Promise<ICharge[]> {
    return ChargeModel.find({
      colocationId: new Types.ObjectId(colocationId),
      isActive: true,
    });
  }

  public async softDeleteCharge(chargeId: string): Promise<ICharge | null> {
    return ChargeModel.findByIdAndUpdate(
      chargeId,
      { isActive: false },
      { new: true }
    );
  }
}
