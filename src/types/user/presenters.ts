import { Expose } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class UserPresenter {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  firstname: string;

  @Expose()
  @IsString()
  lastname: string;

  @Expose()
  @IsString()
  email: string;

  @Expose()
  @IsString()
  isActive: boolean;
}