import { Expose } from "class-transformer";
import { IsString, IsBoolean, IsInt } from "class-validator";

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
  @IsBoolean()
  isActive: boolean;

  @Expose()
  @IsString()
  phone: string;

  @Expose()
  @IsInt()
  age: number;
}
