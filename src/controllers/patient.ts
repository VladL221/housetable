import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import logging from '../config/logging';
import Patient from '../models/patient';

const NAMESPACE = 'Patient controller.ts';

const getAllPateints = (req: Request, res: Response, next: NextFunction) => {
  return Patient.find()
    .exec()
    .then((result) => {
      return res.status(200).json({
        result,
      });
    })
    .catch((error) => {
      logging.error(NAMESPACE, error.message, error);
      return res.status(500).json({
        message: error.message,
        error,
      });
    });
};

const createPatient = (req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line prefer-const
  let { petName, petType, petOwner, petOwnerAddress, petOwnerPhone } = req.body;
  const patient = new Patient({
    _id: new mongoose.Types.ObjectId(),
    petName,
    petType,
    petOwner,
    petOwnerAddress,
    petOwnerPhone,
  });
  return patient
    .save()
    .then((result) => {
      return res.status(201).json({
        result,
      });
    })
    .catch((error) => {
      logging.error(NAMESPACE, error.message, error);
      return res.status(500).json({
        message: error.message,
        error,
      });
    });
};

const updatePatient = (req: Request, res: Response, next: NextFunction) => {
  const {
    petName,
    petType,
    petOwner,
    petOwnerAddress,
    petOwnerPhone,
    ObjectId,
  } = req.body;
  const updatesPateint = {
    petName: petName,
    petType: petType,
    petOwner: petOwner,
    petOwnerAddress: petOwnerAddress,
    petOwnerPhone: petOwnerPhone,
  };
  Patient.findOneAndUpdate({ _id: ObjectId }, updatesPateint)
    .then((result) => {
      return res.status(200).json({
        result,
      });
    })
    .catch((error) => {
      logging.error(NAMESPACE, error.message, error);
      return res.status(500).json({
        message: error.message,
        error,
      });
    });
};

const deletePatient = (req: Request, res: Response, next: NextFunction) => {
  const { ObjectId } = req.body;
  Patient.deleteOne({ _id: ObjectId })
    .then((result) => {
      return res.status(200).json({
        result,
      });
    })
    .catch((error) => {
      logging.error(NAMESPACE, error.message, error);
      return res.status(500).json({
        message: error.message,
        error,
      });
    });
};

export default { createPatient, getAllPateints, updatePatient, deletePatient };
