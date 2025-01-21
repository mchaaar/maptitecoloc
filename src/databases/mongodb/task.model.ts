import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITask extends Document {
  _id: Types.ObjectId;
  name: string;
  assignedTo: string;
  dueDate: Date;
  status: string;
}

const TaskSchema: Schema = new Schema({
  name: { type: String, required: true },
  assignedTo: { type: String, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
});

export const Task = mongoose.model<ITask>("Task", TaskSchema);