import { Expose, Type } from "class-transformer";
import { IsString, IsNotEmpty, IsNumber, ValidateNested, IsArray, Min, IsOptional } from "class-validator";

export class SplitPartDTO {
  @Expose()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @Expose()
  @IsNumber()
  @Min(0)
  amount: number;
}

export class CreateChargeDTO {
  @Expose()
  @IsString()
  @IsNotEmpty()
  colocationId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Expose()
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  paidBy: string;

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SplitPartDTO)
  split: SplitPartDTO[];
}

export class SoftDeleteChargeDTO {
  @Expose()
  @IsString()
  @IsNotEmpty()
  chargeId: string;
}

export class CreatePaymentDTO {
  @Expose()
  @IsString()
  @IsNotEmpty()
  colocationId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  fromUser: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  toUser: string;

  @Expose()
  @IsNumber()
  @Min(0)
  amount: number;

  @Expose()
  @IsString()
  @IsOptional()
  note?: string;
}
