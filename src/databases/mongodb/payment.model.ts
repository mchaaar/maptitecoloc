import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPayment extends Document {
  _id: Types.ObjectId;
  colocationId: Types.ObjectId;
  fromUser: Types.ObjectId;
  toUser: Types.ObjectId;
  amount: number;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema<IPayment> = new Schema(
  {
    colocationId: { type: Schema.Types.ObjectId, ref: "Colocation", required: true },
    fromUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    toUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    note: { type: String },
  },
  { timestamps: true }
);

export const PaymentModel = mongoose.model<IPayment>("Payment", PaymentSchema);
