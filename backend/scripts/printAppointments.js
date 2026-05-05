const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const Appointment = require('../models/Appointment');

async function main() {
	const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/appointpro';
	await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	try {
		const docs = await Appointment.find().sort({ date: 1, startTime: 1 }).lean();
		console.log('Total appointments:', docs.length);
		for (const a of docs) {
			console.log(`[${a._id}] ${a.date} ${a.startTime}-${a.endTime} | ${a.clientName || a.patientName || 'N/A'} | status: ${a.status || 'scheduled'}`);
		}
	} catch (err) {
		console.error('Error reading appointments:', err);
	} finally {
		await mongoose.connection.close();
	}
}

main();
