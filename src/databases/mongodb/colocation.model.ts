import mongoose, { Schema, Document, Types } from "mongoose";

export interface IColocation extends Document {
  _id: Types.ObjectId;
  name: string;
  location: string;
  surface: number;
  roomCount: number;
  agency?: string;
  owner?: string;
  members: Types.ObjectId[];
  createdBy: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ColocationSchema: Schema<IColocation> = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    surface: { type: Number, required: true },
    roomCount: { type: Number, required: true },
    agency: { type: String },
    owner: { type: String },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ColocationModel = mongoose.model<IColocation>(
  "Colocation",
  ColocationSchema
);
