const express = require('express');
const router = express.Router();
const { 
    getAllAppointments, 
    getAppointmentById,
    createAppointment, 
    updateAppointment, 
    deleteAppointment,
    getAppointmentsByDateRange,
    getAppointmentsByStatus,
    getAllUsers,
    createUser
} = require('../controllers/index');

// Appointment routes
router.get('/appointments', getAllAppointments);
router.get('/appointments/range', getAppointmentsByDateRange);
router.get('/appointments/status/:status', getAppointmentsByStatus);
router.get('/appointments/:id', getAppointmentById);
router.post('/appointments', createAppointment);
router.put('/appointments/:id', updateAppointment);
router.delete('/appointments/:id', deleteAppointment);

// User routes
router.get('/users', getAllUsers);
router.post('/users', createUser);

module.exports = router;