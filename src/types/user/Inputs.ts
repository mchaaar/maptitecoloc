import { Expose } from "class-transformer";
import { IsInt, IsString, Min, Max, Matches, IsEmail } from "class-validator";

export class userToCreateInput {
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
  password_hash: string;

  @Expose()
  @IsString()
  @Matches(/^\+?[0-9]{7,15}$/, { message: "Phone must be a valid phone number" })
  phone: string;

  @Expose()
  @IsInt()
  @Min(0)
  @Max(120)
  age: number;

  @Expose()
  @IsString()
  garant: string;
}
