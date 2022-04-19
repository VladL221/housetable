import { Request, Response, NextFunction } from 'express';
import moment from 'moment';
import mongoose from 'mongoose';
import Appointment from '../models/appointment';
import logging from '../config/logging';
import Patient from '../models/patient';
import currencyUtil from '../utils/currency.conversion';
import dateUtil from '../utils/date.converstion';

const NAMESPACE = 'Appointment controller.ts';

const getUnpaidAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const appointments = await Appointment.aggregate([
      {
        $project: {
          startTime: 1,
          endTime: 1,
          description: 1,
          feePaid: 1,
          currency: 1,
          amount: 2,
          isMatch: { $eq: ['$feePaid', '$amount'] },
        },
      },
      { $match: { isMatch: false } },
      {
        $project: {
          startTime: 1,
          endTime: 1,
          description: 1,
          feePaid: 1,
          currency: 1,
          amount: 1,
        },
      },
    ]);
    return res.status(200).json({
      appointments,
    });
  } catch (error) {
    logging.error(NAMESPACE, error.message, error);
    return res.status(400).json({
      message: error.message,
      error,
    });
  }
};

const getAppointmentsForDay = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { dayQuery } = req.body;
  try {
    const from = dayQuery;
    const start = moment(from).format();
    const end = moment(start).add(1, 'days').format();
    const appointments2 = await Appointment.find({
      startTime: {
        $gte: new Date(start),
        $lt: new Date(end),
      },
    });
    return res.status(200).json({
      appointments2,
    });
  } catch (error) {
    logging.error(NAMESPACE, error.message, error);
    return res.status(400).json({
      message: error.message,
      error,
    });
  }
};

const getMostPopularPetType = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const mostPopularPetType = await Patient.aggregate([
      {
        $group: {
          _id: { petType: '$petType' },
          petType: { $sum: 1 },
          patients: { $push: '$_id' },
        },
      },
      { $sort: { petType: -1 } },
    ]);

    const filteredAppointments = await Appointment.aggregate([
      { $match: {} },
      {
        $group: {
          _id: {
            patient: '$patient',
            currency: '$currency',
          },
          feePaid: { $sum: '$feePaid' },
          amount: { $sum: '$amount' },
        },
      },
    ]);
    const sortedObjestsByTypes = {};
    mostPopularPetType.forEach((x) => {
      let patients: [] = x['patients'];
      for (let index = 0; index < patients.length; index++) {
        if (sortedObjestsByTypes[x['patients'][index]]) {
          continue;
        } else {
          sortedObjestsByTypes[x['patients'][index]] = x['_id']['petType'];
        }
      }
    });
    const sortedPetTypesAndProfit = [];
    filteredAppointments.forEach((x) => {
      if (sortedObjestsByTypes[x['_id']['patient']]) {
        if (
          sortedPetTypesAndProfit[sortedObjestsByTypes[x['_id']['patient']]]
        ) {
        }
        sortedPetTypesAndProfit.push({
          petType: [sortedObjestsByTypes[x['_id']['patient']]],
          currency: x['_id']['currency'],
          profit: x['feePaid'] - x['amount'],
        });
      }
    });
    return res.status(200).json({ sortedPetTypesAndProfit });
  } catch (error) {
    logging.error(NAMESPACE, error.message, error);
    return res.status(400).json({
      message: error.message,
      error,
    });
  }
};

const getWeeklyOrMonthlyAmountPaid = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const formatedFirstAndLastDay = req.url.includes('week')
      ? dateUtil.getDaysOfWeek()
      : dateUtil.getDaysOfMonth();
    const appoinements = await Appointment.aggregate([
      {
        $match: {
          startTime: {
            $gte: new Date(formatedFirstAndLastDay[0]),
            $lt: new Date(formatedFirstAndLastDay[1]),
          },
        },
      },
      {
        $group: {
          _id: '$currency',
          totalFeePaid: { $sum: '$feePaid' },
          amountToPay: { $sum: '$amount' },
        },
      },
    ]);
    const totalResult = currencyUtil.convertCurrencyToUSD(appoinements);
    return res.status(200).json({
      totalResult,
    });
  } catch (error) {
    logging.error(NAMESPACE, error.message, error);
    return res.status(400).json({
      message: error.message,
      error,
    });
  }
};

const getAppointmentsForPatient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { objectId } = req.body;
    const appointments = await Appointment.find({
      patient: new mongoose.Types.ObjectId(objectId),
    }).populate({
      path: 'patient',
      model: 'Patient',
      select: 'petName',
    });
    return res.status(200).json({
      appointments,
    });
  } catch (error) {
    logging.error(NAMESPACE, error.message, error);
    return res.status(400).json({
      message: error.message,
      error,
    });
  }
};

const getRemainingBillForPatient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { ObjectId } = req.body;
    const appoinements = await Appointment.aggregate([
      {
        $match: {
          patient: {
            $in: [new mongoose.Types.ObjectId(ObjectId)],
          },
        },
      },
      {
        $project: {
          startTime: 1,
          endTime: 1,
          description: 1,
          feePaid: 1,
          currency: 1,
          amount: 2,
          isMatch: { $eq: ['$feePaid', '$amount'] },
        },
      },
      { $match: { isMatch: false } },
      {
        $project: {
          startTime: 1,
          endTime: 1,
          description: 1,
          feePaid: 1,
          currency: 1,
          amount: 1,
        },
      },
    ]);
    return res.status(200).json({
      appoinements,
    });
  } catch (error) {
    logging.error(NAMESPACE, error.message, error);
    return res.status(400).json({
      message: error.message,
      error,
    });
  }
};

const createAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      startTime,
      endTime,
      description,
      feePaid,
      currency,
      amount,
      objectId,
    } = req.body;
    const appointment = new Appointment({
      _id: new mongoose.Types.ObjectId(),
      startTime,
      endTime,
      description,
      feePaid,
      currency,
      amount,
    });
    appointment.patient = new mongoose.Types.ObjectId(objectId);
    const appointmentCreated = await appointment.save();
    return res.status(201).json({
      appointment: appointmentCreated,
    });
  } catch (error) {
    logging.error(NAMESPACE, error.message, error);
    return res.status(400).json({
      message: error.message,
      error,
    });
  }
};

const updateAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      startTime,
      endTime,
      description,
      feePaid,
      currency,
      amount,
      ObjectId,
    } = req.body;
    const updateAppointment = {
      startTime: startTime,
      endTime: endTime,
      description: description,
      feePaid: feePaid,
      currency: currency,
      amount: amount,
    };
    await Appointment.findOneAndUpdate({ _id: ObjectId }, updateAppointment);
    return res.status(200).json({});
  } catch (error) {
    logging.error(NAMESPACE, error.message, error);
    return res.status(400).json({
      message: error.message,
      error,
    });
  }
};

const deleteAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { ObjectId } = req.body;
    const deletedAppointment = await Appointment.deleteOne({ _id: ObjectId });
    return res.status(200).json({
      deletedAppointment,
    });
  } catch (error) {
    logging.error(NAMESPACE, error.message, error);
    return res.status(400).json({
      message: error.message,
      error,
    });
  }
};

export default {
  createAppointment,
  getAppointmentsForPatient,
  updateAppointment,
  deleteAppointment,
  getAppointmentsForDay,
  getUnpaidAppointments,
  getRemainingBillForPatient,
  getWeeklyOrMonthlyAmountPaid,
  getMostPopularPetType,
};
