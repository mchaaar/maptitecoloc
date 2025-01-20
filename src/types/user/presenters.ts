import { Expose } from "class-transformer";
import { IsNumber, IsString } from "class-validator";
import { UserEntity } from "../../databases/mysql/user.entity";

export class UserPresenter {
  @Expose()
  @IsNumber()
  id: UserEntity['id'];

  @Expose()
  @IsString()
  firstname: UserEntity['firstname'];

  // à vous de jouer
  lastname: string;
  email: string;
  isActive: boolean;
}