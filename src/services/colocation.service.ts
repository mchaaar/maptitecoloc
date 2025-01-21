import { IColocation } from "../databases/mongodb/colocation.model";
import { ColocationRepository } from "../repositories/colocation.repository";
import { CreateColocationDTO, AddMemberDTO } from "../types/colocation/dtos";
import { Types } from "mongoose";
import { ActionLogService } from "./actionLog.service";

export class ColocationService {
  private colocationRepository: ColocationRepository;
  private actionLogService: ActionLogService;

  constructor() {
    this.colocationRepository = new ColocationRepository();
    this.actionLogService = new ActionLogService();
  }

  public async createColocation(
    userId: string,
    dto: CreateColocationDTO
  ): Promise<IColocation> {
    const data: Partial<IColocation> = {
      name: dto.name,
      location: dto.location,
      surface: dto.surface,
      roomCount: dto.roomCount,
      agency: dto.agency,
      owner: dto.owner,
      createdBy: new Types.ObjectId(userId),
      members: [new Types.ObjectId(userId)],
      isActive: true,
    };

    const colocation = await this.colocationRepository.createColocation(data);

    await this.actionLogService.logAction({
      action: "COLOCATION_CREATED",
      userId: new Types.ObjectId(userId),
      colocationId: colocation._id,
      payload: { dto },
    });

    return colocation;
  }

  public async getUserColocations(userId: string): Promise<IColocation[]> {
    return this.colocationRepository.findUserColocations(userId);
  }

  public async getColocationDetails(
    userId: string,
    colocationId: string
  ): Promise<IColocation | null> {
    const colocation = await this.colocationRepository.findActiveById(colocationId);
    if (!colocation) return null;

    const isCreator = colocation.createdBy.equals(userId);
    const isMember = colocation.members.some((m) => m.equals(userId));
    if (!isCreator && !isMember) {
      return null;
    }

    return colocation;
  }

  public async deleteColocation(userId: string, colocationId: string): Promise<IColocation | null> {
    const colocation = await this.colocationRepository.findActiveById(colocationId);
    if (!colocation) return null;

    if (!colocation.createdBy.equals(userId)) {
      throw new Error("Not allowed");
    }

    const deleted = await this.colocationRepository.softDeleteColocation(colocationId);

    if (deleted) {
      await this.actionLogService.logAction({
        action: "COLOCATION_DELETED",
        userId: colocation.createdBy,
        colocationId: deleted._id,
      });
    }

    return deleted;
  }

  public async addMember(userId: string, dto: AddMemberDTO): Promise<IColocation | null> {
    const colocation = await this.colocationRepository.findActiveById(dto.colocationId);
    if (!colocation) {
      throw new Error("Colocation not found");
    }

    if (!colocation.createdBy.equals(userId)) {
      throw new Error("Not allowed to add members");
    }

    const updated = await this.colocationRepository.addMember(dto.colocationId, dto.memberId);

    if (updated) {
      await this.actionLogService.logAction({
        action: "COLOCATION_MEMBER_ADDED",
        userId: new Types.ObjectId(userId),
        colocationId: updated._id,
        payload: { newMemberId: dto.memberId },
      });
    }

    return updated;
  }

  public async removeMember(userId: string, dto: AddMemberDTO): Promise<IColocation | null> {
    const colocation = await this.colocationRepository.findActiveById(dto.colocationId);
    if (!colocation) {
      throw new Error("Colocation not found");
    }

    if (!colocation.createdBy.equals(userId)) {
      throw new Error("Not allowed to remove members");
    }

    const updated = await this.colocationRepository.removeMember(dto.colocationId, dto.memberId);

    if (updated) {
      await this.actionLogService.logAction({
        action: "COLOCATION_MEMBER_REMOVED",
        userId: new Types.ObjectId(userId),
        colocationId: updated._id,
        payload: { removedMemberId: dto.memberId },
      });
    }

    return updated;
  }

  public async transferOwnership(
    userId: string,
    colocationId: string,
    newOwnerId: string
  ): Promise<IColocation | null> {
    const colocation = await this.colocationRepository.findActiveById(colocationId);
    if (!colocation) {
      throw new Error("Colocation not found");
    }

    if (!colocation.createdBy.equals(userId)) {
      throw new Error("Not allowed to transfer ownership");
    }

    const isMember = colocation.members.some((m) => m.equals(newOwnerId));
    if (!isMember) {
      throw new Error("New owner must be a member of the colocation");
    }

    const updated = await this.colocationRepository.transferOwnership(
      colocationId,
      newOwnerId
    );

    if (updated) {
      await this.actionLogService.logAction({
        action: "COLOCATION_OWNERSHIP_TRANSFERRED",
        userId: new Types.ObjectId(userId),
        colocationId: updated._id,
        payload: { oldOwner: userId, newOwner: newOwnerId },
      });
    }

    return updated;
  }
}
