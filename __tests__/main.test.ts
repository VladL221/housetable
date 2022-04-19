import mongoose from 'mongoose';
import request from 'supertest';
import config from './../src/config/config';
import server from '../src/server';
import logging from './../src/config/logging';
import Patient from '../src/models/patient';
import Appointment from '../src/models/appointment';

const NAMESPACE = 'Unit testing appointment';

beforeAll(async () => {
  await mongoose.connect(config.mongo.localurltesting, config.mongo.options);
});

beforeAll(async () => await Appointment.collection.drop());

describe('DB creating first appointments', () => {
  it('should pass 1', async () => {
    const patient = await Patient.findOne({});
    const appointment = new Appointment({
      _id: new mongoose.Types.ObjectId(),
      startTime: new Date('2022-04-02'),
      endTime: new Date('2022-04-02'),
      description: 'Dog too cute need hugs',
      feePaid: 25,
      currency: 'BTC',
      amount: 30,
    });
    appointment.patient = new mongoose.Types.ObjectId(patient['_id']);
    const appointmentSaved = await appointment.save();
    expect(appointmentSaved._id).toBe(appointment._id);
  });
  it('should pass 2', async () => {
    const patient = await Patient.findOne({});
    const appointment = new Appointment({
      _id: new mongoose.Types.ObjectId(),
      startTime: new Date('2022-04-22'),
      endTime: new Date('2022-04-22'),
      description: 'Dog too cute need hugs',
      feePaid: 10,
      currency: 'EUR',
      amount: 25,
    });
    appointment.patient = new mongoose.Types.ObjectId(patient['_id']);
    const appointmentSaved = await appointment.save();
  });
  it('should pass 3', async () => {
    const patient = await Patient.findOne({});
    const appointment = new Appointment({
      _id: new mongoose.Types.ObjectId(),
      startTime: new Date('2022-04-30'),
      endTime: new Date('2022-04-30'),
      description: 'Dog required heart transplant cause he too cute',
      feePaid: 11,
      currency: 'BTC',
      amount: 11,
    });
    appointment.patient = new mongoose.Types.ObjectId(patient['_id']);
    const appointmentSaved = await appointment.save();
    expect(appointmentSaved._id).toBe(appointment._id);
  });
  it('should pass 4', async () => {
    const patient = await Patient.findOne({});
    const appointment = new Appointment({
      _id: new mongoose.Types.ObjectId(),
      startTime: new Date(),
      endTime: new Date(),
      description: 'Dog required heart transplant cause he too cute',
      feePaid: 25,
      currency: 'EUR',
      amount: 25,
    });
    appointment.patient = new mongoose.Types.ObjectId(patient['_id']);
    const appointmentSaved = await appointment.save();
    expect(appointmentSaved._id).toBe(appointment._id);
  });
  it('should pass 5', async () => {
    const patient = await Patient.findOne({ petOwnerPhone: '111222333' });
    const appointment = new Appointment({
      _id: new mongoose.Types.ObjectId(),
      startTime: new Date('2022-04-19'),
      endTime: new Date('2022-04-19'),
      description: 'Dog NEEDS LOTSA PETTING',
      feePaid: 50,
      currency: 'BTC',
      amount: 70,
    });
    appointment.patient = new mongoose.Types.ObjectId(patient['_id']);

    const appointmentSaved = await appointment.save();
    expect(appointmentSaved._id).toBe(appointment._id);
  });
  it('should pass 6', async () => {
    const patient = await Patient.findOne({ petOwnerPhone: '111222333' });
    const appointment = new Appointment({
      _id: new mongoose.Types.ObjectId(),
      startTime: new Date('2022-04-20'),
      endTime: new Date('2022-04-20'),
      description: 'Dog needs huggies',
      feePaid: 25,
      currency: 'EUR',
      amount: 50,
    });
    appointment.patient = new mongoose.Types.ObjectId(patient['_id']);
    const appointmentSaved = await appointment.save();
    expect(appointmentSaved._id).toBe(appointment._id);
  });
  it('should pass 7', async () => {
    const patient = await Patient.findOne({ petOwnerPhone: '111222333' });
    const appointment = new Appointment({
      _id: new mongoose.Types.ObjectId(),
      startTime: new Date('2022-04-18'),
      endTime: new Date('2022-04-18'),
      description: 'Dog needs huggies MORE',
      feePaid: 25,
      currency: 'USD',
      amount: 30,
    });
    appointment.patient = new mongoose.Types.ObjectId(patient['_id']);
    const appointmentSaved = await appointment.save();
    expect(appointmentSaved._id).toBe(appointment._id);
  });
});

describe('Creating an appointment with api call', () => {
  it('should pass', async () => {
    const patientToAppend = await Patient.findOne({});
    const createdAppointment = {
      startTime: '2022-04-01T15:00:49+09:00',
      endTime: '2022-04-01T16:00:49+09:00',
      description: 'xdddddddddddddddddddddddddddddddd',
      feePaid: 10,
      curency: 'EUR',
      amount: 70,
      objectId: patientToAppend._id,
    };
    const res = await request(server.router)
      .post('/api/appointment/')
      .send(createdAppointment)
      .expect(201);
    logging.info(NAMESPACE, 'creating an appointment', res.body);
  });
});

describe('Getting appointments for a pecific patient using api call', () => {
  it('should pass', async () => {
    const PatientToSearch = await Patient.findOne({});
    const patient = {
      objectId: PatientToSearch._id,
    };
    const res = await request(server.router)
      .get('/api/appointment/patient/')
      .send(patient)
      .expect(200);
    logging.info(NAMESPACE, 'fetching appointments', res.body);
  });
});

describe('Updating appointment details using api call', () => {
  it('should pass', async () => {
    const appointment = {
      startTime: '2022-09-20T11:00:49+09:00',
      endTime: '2022-09-20T18:00:49+09:00',
      description: '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',
      feePaid: 25,
      currency: 'BTC',
      amount: 25,
      ObjectId: '625d573dca1846f6c12e503a',
    };
    const res = await request(server.router)
      .put('/api/appointment/')
      .send(appointment)
      .expect(200);
    logging.info(
      NAMESPACE,
      'Updating appointment by objectid of the appointment',
      res.body,
    );
  });
});

describe('Deleting appointment details using api call', () => {
  it('should pass', async () => {
    const appointment = await Appointment.findOne({});
    const res = await request(server.router)
      .delete('/api/appointment/')
      .send({ ObjectId: appointment['_id'] })
      .expect(200);
    logging.info(
      NAMESPACE,
      'Deleting appointment details',
      res.body['deletedAppointment']['deletedCount'],
    );
  });
});

describe('Get a list of appointments for a specific day from api call', () => {
  it('should pass', async () => {
    const magicDate = '2022-04-18';
    const res = await request(server.router)
      .get('/api/appointment/day')
      .send({ dayQuery: magicDate })
      .expect(200);
    logging.info(
      NAMESPACE,
      'Getting a list of appointments for a specific day',
      res.body,
    );
  });
});

describe('Get a list of unpaid appointments from api call', () => {
  it('should pass', async () => {
    const res = await request(server.router)
      .get('/api/appointment/unpaid')
      .expect(200);
    logging.info(NAMESPACE, 'GEtting a list of unpaid appointments', res.body);
  });
});

describe('Get a remaining bill for a specific patient from api call', () => {
  it('should pass', async () => {
    const patient = await Patient.findOne({});
    const res = await request(server.router)
      .get('/api/appointment/remainingBill')
      .send({ ObjectId: patient._id })
      .expect(200);
    logging.info(
      NAMESPACE,
      'Getting a remaining bill for a specific patient',
      res.body,
    );
  });
});

describe('Get the weekly and monthly amount paid, unpaid and balance of hospital in dollars from api call', () => {
  it('should pass 1', async () => {
    const res = await request(server.router)
      .get('/api/appointment/month')
      .expect(200);
    logging.info(
      NAMESPACE,
      'Getting the monthly amount paid, unpaid and balance of hospital in dollars',
      res.body,
    );
  });

  it('should pass 2', async () => {
    const res = await request(server.router)
      .get('/api/appointment/week')
      .expect(200);
    logging.info(
      NAMESPACE,
      'Getting the weekly amount paid, unpaid and balance of hospital in dollars',
      res.body,
    );
  });
});

describe('Get the most popular pet type, and how much money the hospital makes from each pet type from api call', () => {
  it('should pass', async () => {
    const res = await request(server.router)
      .get('/api/appointment/populartype')
      .expect(200);
    logging.info(
      NAMESPACE,
      'GEtting the most popular pet type and the profit per pet type',
      res.body,
    );
  });
});

afterAll(async () => server.httpServer.close());
afterAll(async () => await mongoose.connection.close());
