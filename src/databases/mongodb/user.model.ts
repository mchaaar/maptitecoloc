import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  age: number;
  passwordHash: string;
  photo?: string;
  isActive: boolean;
}

const UserSchema: Schema<IUser> = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  passwordHash: { type: String, required: true },
  photo: { type: String },
  isActive: { type: Boolean, default: true },
},
{
  timestamps: true,
});

export const UserModel = mongoose.model<IUser>("User", UserSchema);
