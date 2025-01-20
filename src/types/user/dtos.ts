import { Expose } from "class-transformer";
import { IsString, IsEmail } from "class-validator";

export class UserToCreateDTO {
  @Expose()
  @IsString()
  firstname: string;

  @Expose()
  @IsString()
  lastname: string;

  @Expose()
  @IsString()
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @Expose()
  @IsString()
  password: string;
}