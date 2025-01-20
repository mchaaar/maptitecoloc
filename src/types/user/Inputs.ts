import { Expose } from "class-transformer";
import { IsString } from "class-validator";
import { UserEntity } from "../../databases/mysql/user.entity";

export class userToCreateInput {
  @Expose()
  @IsString()
  firstname: UserEntity['firstname'];

  // à vous de jouer
  lastname: string;
  email: string;

  @Expose()
  @IsString()
  password_hash: UserEntity['password_hash'];
}