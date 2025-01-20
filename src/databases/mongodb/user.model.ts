import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password_hash: string;
}

const UserSchema: Schema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
});

export const UserModel = mongoose.model<IUser>("User", UserSchema);