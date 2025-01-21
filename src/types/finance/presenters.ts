import { Expose } from "class-transformer";
import { IsBoolean, IsNumber } from "class-validator";

export class ChargeSplitPresenter {
  @Expose()
  userId: string;

  @Expose()
  @IsNumber()
  amount: number;
}

export class ChargePresenter {
  @Expose()
  id: string;

  @Expose()
  colocationId: string;

  @Expose()
  title: string;

  @Expose()
  @IsNumber()
  totalAmount: number;

  @Expose()
  paidBy: string;

  @Expose()
  split: ChargeSplitPresenter[];

  @Expose()
  @IsBoolean()
  isActive: boolean;
}

export class PaymentPresenter {
  @Expose()
  id: string;

  @Expose()
  colocationId: string;

  @Expose()
  fromUser: string;

  @Expose()
  toUser: string;

  @Expose()
  @IsNumber()
  amount: number;

  @Expose()
  note: string | null;
}
