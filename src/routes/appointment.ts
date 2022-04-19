import express from 'express';
import controller from '../controllers/appointment';

const router = express.Router();

// remove the get post dleete put , remove the appointments same for patient
router.get('/patient/', controller.getAppointmentsForPatient);
router.post('/', controller.createAppointment);
router.put('/', controller.updateAppointment);
router.delete('/', controller.deleteAppointment);
router.get('/day', controller.getAppointmentsForDay);
router.get('/week', controller.getWeeklyOrMonthlyAmountPaid);
router.get('/month', controller.getWeeklyOrMonthlyAmountPaid);
router.get('/unpaid', controller.getUnpaidAppointments);
router.get('/populartype', controller.getMostPopularPetType);
router.get('/remainingBill', controller.getRemainingBillForPatient);

export = router;
