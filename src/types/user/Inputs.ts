import { Expose } from "class-transformer";
import { IsString } from "class-validator";

export class userToCreateInput {
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
  password_hash: string;
}