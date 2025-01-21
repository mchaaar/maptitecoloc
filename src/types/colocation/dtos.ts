import { Expose } from "class-transformer";
import { IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateColocationDTO {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  location: string;

  @Expose()
  @IsNumber()
  surface: number;

  @Expose()
  @IsNumber()
  roomCount: number;

  @Expose()
  @IsString()
  @IsOptional()
  agency?: string;

  @Expose()
  @IsString()
  @IsOptional()
  owner?: string;
}

export class AddMemberDTO {
  @Expose()
  @IsString()
  @IsNotEmpty()
  colocationId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  memberId: string;
}

export class TransferOwnershipDTO {
  @Expose()
  @IsString()
  @IsNotEmpty()
  colocationId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  newOwnerId: string;
}
