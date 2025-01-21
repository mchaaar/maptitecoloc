import mongoose, { Schema, Document, Types } from "mongoose";

export interface IChargeSplit {
  userId: Types.ObjectId;
  amount: number;
}

export interface ICharge extends Document {
  _id: Types.ObjectId;
  colocationId: Types.ObjectId;
  title: string;
  totalAmount: number;
  paidBy: Types.ObjectId;
  split: IChargeSplit[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChargeSchema: Schema<ICharge> = new Schema(
  {
    colocationId: { type: Schema.Types.ObjectId, ref: "Colocation", required: true },
    title: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    paidBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    split: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        amount: { type: Number, required: true },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ChargeModel = mongoose.model<ICharge>("Charge", ChargeSchema);
