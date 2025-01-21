import { TaskRepository } from "../repositories/task.repository";
import { TaskToCreateDTO } from "../types/user/dtos";
import { ITask } from "../databases/mongodb/task.model";

export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  public async createTask(data: TaskToCreateDTO): Promise<ITask> {
    return this.taskRepository.createTask({
      name: data.name,
      assignedTo: data.assignedTo,
      dueDate: new Date(data.dueDate),
      status: data.status,
    });
  }
}
