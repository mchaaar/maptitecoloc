import mongoose, { Schema, Document, Types } from "mongoose";

export interface IActionLog extends Document {
  _id: Types.ObjectId;
  action: string;
  userId?: Types.ObjectId;
  colocationId?: Types.ObjectId;
  payload?: any;
  createdAt: Date;
}

const ActionLogSchema: Schema<IActionLog> = new Schema(
  {
    action: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    colocationId: { type: Schema.Types.ObjectId, ref: "Colocation" },
    payload: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ActionLogModel = mongoose.model<IActionLog>(
  "ActionLog",
  ActionLogSchema
);
