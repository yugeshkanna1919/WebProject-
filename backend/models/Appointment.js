const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
	doctorId: { type: mongoose.Schema.Types.ObjectId, required: false, index: true },
	patientName: { type: String },
	title: { type: String },
	description: { type: String },
	clientName: { type: String },
	clientEmail: { type: String },
	clientPhone: { type: String },
	status: { type: String, default: 'scheduled' },
	date: { type: String, required: true, index: true }, // YYYY-MM-DD
	startTime: { type: String, required: true }, // HH:mm
	endTime: { type: String, required: true }, // HH:mm
	notes: { type: String }
}, {
	timestamps: true
});

// Prevent double booking: one appointment per exact slot (globally)
AppointmentSchema.index({ date: 1, startTime: 1, endTime: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
