import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import IAppointment from '../interfaces/appointment';

const appointmentSchema: Schema = new Schema(
  {
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    description: { type: String, required: false },
    feePaid: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, default: 'USD' },
    amount: { type: Number, required: true },
    patient: { type: mongoose.Types.ObjectId, ref: 'Patient' },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IAppointment>('Appointment', appointmentSchema);
