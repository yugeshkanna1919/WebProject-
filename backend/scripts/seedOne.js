const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const Appointment = require('../models/Appointment');

async function main() {
	await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/appointpro', {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
	try {
		const doc = await Appointment.create({
			title: 'Dental Checkup',
			description: 'Routine checkup',
			date: '2025-09-22',
			startTime: '09:00',
			endTime: '09:15',
			clientName: 'Test Patient',
			clientEmail: 'test@example.com',
			clientPhone: '+911234567890',
			status: 'scheduled',
			notes: 'Seeded appointment'
		});
		console.log('SEEDED', doc._id.toString());
	} catch (err) {
		if (err && err.code === 11000) {
			console.log('ALREADY_EXISTS');
		} else {
			console.error(err);
			process.exitCode = 1;
		}
	} finally {
		await mongoose.connection.close();
	}
}

main();
