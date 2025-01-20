import { Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength, IsInt, Min } from "class-validator";

export class UserToCreateDTO {
  @Expose()
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  lastname: string;
  
  @Expose()
  @IsString()
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @Expose()
  @IsInt()
  @Min(18, { message: "You must be 18 or older." })
  age: number;

  @Expose()
  @IsString()
  @MinLength(6, { message: "Password must be at least 6 characters long." })
  password: string;

  @Expose()
  @IsString()
  photo?: string;
}

export class UserLoginDTO {
  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  password: string;
}
