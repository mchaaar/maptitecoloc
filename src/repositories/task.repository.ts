import { Task, ITask } from "../databases/mongodb/task.model";

export class TaskRepository {
  public async createTask(taskData: Partial<ITask>): Promise<ITask> {
    const newTask = new Task(taskData);
    return newTask.save();
  }
}
