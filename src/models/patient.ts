import mongoose, { Schema } from 'mongoose';
import IPatient from '../interfaces/patient';

const PatientSchema: Schema = new Schema(
  {
    petName: { type: String, required: true },
    petType: { type: String, required: true },
    petOwner: { type: String, required: true },
    petOwnerAddress: { type: String, required: true },
    petOwnerPhone: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IPatient>('Patient', PatientSchema);
