import { RequestHandler } from "express";import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { TaskToCreateDTO } from "../types/user/dtos";
import { TaskService } from "../services/task.service";
import { TaskPresenter } from "../types/user/presenters";

const taskService = new TaskService();

function formatValidationErrors(validationErrors: any[]): Array<{ field: string; message: string }> {
  return validationErrors.map((err) => {
    const field = err.property;
    const constraints = Object.values(err.constraints);
    return { field, message: constraints[0] as string };
  });
}

export const addTask: RequestHandler = async (req, res, next) => {
  try {
    const taskToCreateDTO = plainToInstance(TaskToCreateDTO, req.body, {
      excludeExtraneousValues: true,
    });

    const errors = await validate(taskToCreateDTO);
    if (errors.length > 0) {
      res.status(400).json({
        statusCode: 400,
        errorCode: "VALIDATION_ERROR",
        errMessage: "Validation failed",
        errorFields: formatValidationErrors(errors),
      });
      return;
    }

    const task = await taskService.createTask(taskToCreateDTO);

    const taskPresenter = new TaskPresenter();
    taskPresenter.id = task._id.toString();
    taskPresenter.name = task.name;
    taskPresenter.assignedTo = task.assignedTo;
    taskPresenter.dueDate = task.dueDate;
    taskPresenter.status = task.status;

    res.status(201).json(taskPresenter);
  } catch (error) {
    next(error);
  }
};