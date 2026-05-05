const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

function timeToMinutes(hhmm) {
	const [h, m] = hhmm.split(':').map(Number);
	return h * 60 + m;
}

function minutesToTime(mins) {
	const h = Math.floor(mins / 60).toString().padStart(2, '0');
	const m = (mins % 60).toString().padStart(2, '0');
	return `${h}:${m}`;
}

function generateSlotsForDay() {
	const slots = [];
	const ranges = [
		{ start: '09:00', end: '12:00' },
		{ start: '17:00', end: '21:00' }
	];
	for (const r of ranges) {
		let start = timeToMinutes(r.start);
		const end = timeToMinutes(r.end);
		while (start + 15 <= end) {
			const s = minutesToTime(start);
			const e = minutesToTime(start + 15);
			slots.push({ startTime: s, endTime: e });
			start += 15;
		}
	}
	return slots;
}

// List all appointments (mapped to frontend expected shape)
router.get('/', async (req, res) => {
	try {
		const docs = await Appointment.find().sort({ date: 1, startTime: 1 }).lean();
		const list = docs.map(a => ({
			_id: a._id,
			title: a.title || (a.patientName ? `Appointment with ${a.patientName}` : 'Appointment'),
			clientName: a.clientName || a.patientName || 'N/A',
			clientEmail: a.clientEmail || '',
			clientPhone: a.clientPhone || '',
			date: a.date,
			time: `${a.startTime} - ${a.endTime}`,
			duration: 15,
			status: a.status || 'scheduled',
			notes: a.notes || ''
		}));
		res.json(list);
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: 'Failed to list appointments' });
	}
});

// Create appointment from React form
router.post('/', async (req, res) => {
	try {
		const { title, description, date, time, duration, clientName, clientEmail, clientPhone, notes, status } = req.body;
		if (!date || !time) {
			return res.status(400).json({ success: false, message: 'date and time are required' });
		}
		const startTime = time;
		const endTime = minutesToTime(timeToMinutes(time) + (parseInt(duration, 10) || 15));
		const created = await Appointment.create({ title, description, date, startTime, endTime, clientName, clientEmail, clientPhone, notes, status });
		res.status(201).json({ success: true, appointment: created });
	} catch (err) {
		if (err && err.code === 11000) {
			return res.status(409).json({ success: false, message: 'Slot already booked' });
		}
		console.error(err);
		res.status(500).json({ success: false, message: 'Failed to create appointment' });
	}
});

// GET /api/appointments/available?date=YYYY-MM-DD&doctorId=...
router.get('/available', async (req, res) => {
	try {
		const { date, doctorId } = req.query;
		if (!date) {
			return res.status(400).json({ success: false, message: 'date is required', slots: [] });
		}
		const daySlots = generateSlotsForDay();
		const filter = { date };
		if (doctorId) filter.doctorId = doctorId;
		const existing = await Appointment.find(filter).select('startTime endTime').lean();
		const taken = new Set(existing.map(a => `${a.startTime}-${a.endTime}`));
		const available = daySlots.filter(s => !taken.has(`${s.startTime}-${s.endTime}`));
		res.set('Cache-Control', 'no-store');
		res.type('application/json');
		return res.status(200).json({ success: true, date, doctorId, slots: available });
	} catch (err) {
		console.error(err);
		res.set('Cache-Control', 'no-store');
		return res.status(200).json({ success: false, message: 'Failed to fetch available slots', slots: [] });
	}
});

// POST /api/appointments/book
// body: { doctorId?, patientName, date, startTime }
router.post('/book', async (req, res) => {
	try {
		const { doctorId, patientName, date, startTime } = req.body;
		if (!patientName || !date || !startTime) {
			return res.status(400).json({ success: false, message: 'patientName, date, startTime required' });
		}
		const endTime = minutesToTime(timeToMinutes(startTime) + 15);
		const appt = await Appointment.create({ doctorId, patientName, date, startTime, endTime });
		res.status(201).json({ success: true, appointment: appt });
	} catch (err) {
		if (err && err.code === 11000) {
			return res.status(409).json({ success: false, message: 'Slot already booked' });
		}
		console.error(err);
		res.status(500).json({ success: false, message: 'Failed to book slot' });
	}
});

// DELETE /api/appointments/:id
router.delete('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		await Appointment.findByIdAndDelete(id);
		res.json({ success: true });
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: 'Failed to delete appointment' });
	}
});

module.exports = router;
