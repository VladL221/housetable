import mongoose from 'mongoose';
import request from 'supertest';
import Patient from '../src/models/patient';
import logging from './../src/config/logging';
import config from './../src/config/config';
import server from '../src/server';

const NAMESPACE = 'Unit testing patient';

beforeAll(async () => {
  await mongoose.connect(config.mongo.localurltesting, config.mongo.options);
});

beforeAll(async () => await Patient.collection.drop());

describe('DB fist patient creation', () => {
  it('should pass 1', async () => {
    const patient = new Patient({
      _id: new mongoose.Types.ObjectId(),
      petName: 'Tofu',
      petType: 'Knaani',
      petOwner: 'Valdo and sofi',
      petOwnerAddress: 'beer sheva',
      petOwnerPhone: '012345678',
    });
    const created = await patient.save();
    expect(created.petOwner).toEqual(patient.petOwner);
  });
  it('should pass 2', async () => {
    const patient = new Patient({
      _id: new mongoose.Types.ObjectId(),
      petName: 'Boni',
      petType: 'poodle',
      petOwner: 'sofi',
      petOwnerAddress: 'ramat gan',
      petOwnerPhone: '111222333',
    });
    const created = await patient.save();
    expect(created.petOwner).toEqual(patient.petOwner);
  });
  it('should pass 3', async () => {
    const patient = new Patient({
      _id: new mongoose.Types.ObjectId(),
      petName: 'bigDog',
      petType: 'poodle',
      petOwner: 'valdo',
      petOwnerAddress: 'ramat gan',
      petOwnerPhone: '111222333333',
    });
    const created = await patient.save();
    expect(created.petOwner).toEqual(patient.petOwner);
  });
});

describe('DB update document', () => {
  it('should pass', async () => {
    const patientToUpdate = {
      petName: 'Tofu',
      petType: 'Knaani',
      petOwner: 'Valdo and sofi',
      petOwnerAddress: 'tel aviv',
      petOwnerPhone: '876543210',
    };
    const patient = await Patient.findOneAndUpdate(
      {
        petOwnerPhone: '012345678',
      },
      patientToUpdate,
      { new: true },
    );
    expect(patient.petOwnerPhone).toBe(patientToUpdate.petOwnerPhone);
  });
});

describe('DB get all patients', () => {
  it('should pass', async () => {
    const patients = await Patient.find({});
    expect(patients).toBe(patients);
    expect(patients).not.toBe({});
  });
});

describe('get all patients api call', () => {
  it('should pass', async () => {
    const res = await request(server.router).get('/api/patient/');
    logging.info(NAMESPACE, 'Fetching all patients', res.body);
    expect(res.statusCode).toEqual(200);
  });
});

describe('creating another patient using api call', () => {
  it('should pass', async () => {
    const newPatient = {
      petName: 'goodboi',
      petType: 'husky',
      petOwner: 'baba-G',
      petOwnerAddress: 'beer sheva',
      petOwnerPhone: 'huski010101101',
    };
    const res = await request(server.router)
      .post('/api/patient/')
      .send(newPatient)
      .expect(201);
    logging.info(NAMESPACE, 'creating patient', res.body);
  });
});

describe('updating patient using api call', () => {
  it('should pass', async () => {
    const patienbtToUpdate = await Patient.findOne({});
    const updatedPatient = {
      petName: 'goodboi',
      petType: 'husky',
      petOwner: 'baba-G',
      petOwnerAddress: 'tel aviv',
      petOwnerPhone: 'huski010101101',
      ObjectId: patienbtToUpdate._id,
    };
    const res = await request(server.router)
      .put('/api/patient/')
      .send(updatedPatient)
      .expect(200);
    logging.info(NAMESPACE, 'updating patient', res.body);
  });
});

describe('deleting patient with api call', () => {
  it('should pass', async () => {
    const patientToDelete = await Patient.findOne({});
    const deletedPatientName = {
      ObjectId: 'goodboi',
    };
    const res = await request(server.router)
      .delete('/api/patient/')
      .send({ ObjectId: patientToDelete._id })
      .expect(200);
    logging.info(NAMESPACE, 'deleting patient', res.body);
  });
});

afterAll(async () => await server.httpServer.close());
afterAll(async () => await mongoose.connection.close());
