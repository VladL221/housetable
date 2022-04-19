import mongoose, { Document } from 'mongoose';

export default interface IAppointment extends Document {
  startTime: Date;
  endTime: Date;
  description: string;
  feePaid: number;
  currency: string;
  amount: number;
  patient?: mongoose.Types.ObjectId;
}
