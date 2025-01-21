import { Expose } from "class-transformer";
import { IsString, IsBoolean, IsInt } from "class-validator";

export class UserPresenter {
  @Expose()
  id: string;

  @Expose()
  firstname: string;

  @Expose()
  lastname: string;

  @Expose()
  email: string;

  @Expose()
  photo?: string;

  @Expose()
  @IsBoolean()
  isActive: boolean;

  @Expose()
  @IsString()
  phone: string;

  @Expose()
  @IsInt()
  age: number;
}

export class TaskPresenter {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  assignedTo: string;

  @Expose()
  dueDate: Date;

  @Expose()
  status: string;
}
