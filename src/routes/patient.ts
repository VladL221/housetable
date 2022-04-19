import express from 'express';
import controller from '../controllers/patient';

const router = express.Router();

router.get('/', controller.getAllPateints);
router.post('/', controller.createPatient);
router.put('/', controller.updatePatient);
router.delete('/', controller.deletePatient);

export = router;
