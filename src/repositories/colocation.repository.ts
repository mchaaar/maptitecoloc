import { ColocationModel, IColocation } from "../databases/mongodb/colocation.model";
import { Types } from "mongoose";

export class ColocationRepository {
  public async createColocation(data: Partial<IColocation>): Promise<IColocation> {
    const colocation = new ColocationModel(data);
    return colocation.save();
  }

  public async findById(id: string): Promise<IColocation | null> {
    return ColocationModel.findById(id);
  }

  public async findActiveById(id: string): Promise<IColocation | null> {
    return ColocationModel.findOne({ _id: id, isActive: true });
  }

  public async findUserColocations(userId: string): Promise<IColocation[]> {
    return ColocationModel.find({
      isActive: true,
      $or: [
        { createdBy: new Types.ObjectId(userId) },
        { members: new Types.ObjectId(userId) },
      ],
    });
  }

  public async softDeleteColocation(id: string): Promise<IColocation | null> {
    return ColocationModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
  }

  public async addMember(colocId: string, userId: string): Promise<IColocation | null> {
    return ColocationModel.findByIdAndUpdate(
      colocId,
      { $addToSet: { members: new Types.ObjectId(userId) } },
      { new: true }
    );
  }

  public async removeMember(colocId: string, userId: string): Promise<IColocation | null> {
    return ColocationModel.findByIdAndUpdate(
      colocId,
      { $pull: { members: new Types.ObjectId(userId) } },
      { new: true }
    );
  }

  public async transferOwnership(
    colocId: string,
    newOwnerId: string
  ): Promise<IColocation | null> {
    return ColocationModel.findByIdAndUpdate(
      colocId,
      { createdBy: new Types.ObjectId(newOwnerId) },
      { new: true }
    );
  }
}
