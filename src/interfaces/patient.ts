import { Document } from 'mongoose';

export default interface IPatient extends Document {
  petName: string;
  petType: string;
  petOwner: string;
  petOwnerAddress: string;
  petOwnerPhone: string;
}
