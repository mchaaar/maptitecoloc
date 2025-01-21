import { ActionLogModel, IActionLog } from "../databases/mongodb/actionLog.model";

export class ActionLogRepository {
  public async logAction(data: Partial<IActionLog>): Promise<IActionLog> {
    const actionLog = new ActionLogModel(data);
    return actionLog.save();
  }
}
