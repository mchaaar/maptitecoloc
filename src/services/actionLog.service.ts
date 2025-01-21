import { ActionLogRepository } from "../repositories/actionLog.repository";
import { IActionLog } from "../databases/mongodb/actionLog.model";

export class ActionLogService {
  private actionLogRepository: ActionLogRepository;

  constructor() {
    this.actionLogRepository = new ActionLogRepository();
  }

  public async logAction(data: Partial<IActionLog>): Promise<IActionLog> {
    return this.actionLogRepository.logAction(data);
  }
}
