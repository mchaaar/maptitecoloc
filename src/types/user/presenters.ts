import { Expose } from "class-transformer";

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
  age: number;

  @Expose()
  photo?: string;

  @Expose()
  isActive: boolean;
}
