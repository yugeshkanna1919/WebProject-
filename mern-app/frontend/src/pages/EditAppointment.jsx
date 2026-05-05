import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CreateAppointment.css';

const EditAppointment = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: new Date(),
        time: '',
        duration: 60,
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        notes: '',
        status: 'scheduled'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAppointment();
    }, [id]);

    const fetchAppointment = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/appointments/${id}`);
            const appointment = response.data;
            
            setFormData({
                title: appointment.title,
                description: appointment.description,
                date: new Date(appointment.date),
                time: appointment.time,
                duration: appointment.duration,
                clientName: appointment.clientName,
                clientEmail: appointment.clientEmail,
                clientPhone: appointment.clientPhone || '',
                notes: appointment.notes || '',
                status: appointment.status
            });
            setError(null);
        } catch (err) {
            setError('Failed to fetch appointment');
            console.error('Error fetching appointment:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (date) => {
        setFormData(prev => ({
            ...prev,
            date: date
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const appointmentData = {
                ...formData,
                date: formData.date.toISOString().split('T')[0]
            };

            await axios.put(`http://localhost:5000/api/appointments/${id}`, appointmentData);
            navigate('/appointments');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update appointment');
            console.error('Error updating appointment:', err);
        } finally {
            setSaving(false);
        }
    };

    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
    ];

    if (loading) {
        return (
            <div className="create-appointment">
                <div className="container">
                    <div className="loading">Loading appointment...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="create-appointment">
            <div className="container">
                <div className="header">
                    <h1>Edit Appointment</h1>
                    <button 
                        onClick={() => navigate('/appointments')} 
                        className="btn btn-secondary"
                    >
                        <i className="fas fa-arrow-left"></i>
                        Back to Appointments
                    </button>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="appointment-form">
                    <div className="form-grid">
                        <div className="form-section">
                            <h3>Appointment Details</h3>
                            
                            <div className="form-group">
                                <label htmlFor="title">Title *</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter appointment title"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description *</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter appointment description"
                                    rows="3"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="date">Date *</label>
                                    <DatePicker
                                        selected={formData.date}
                                        onChange={handleDateChange}
                                        dateFormat="MMM dd, yyyy"
                                        placeholderText="Select date"
                                        className="date-picker"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="time">Time *</label>
                                    <select
                                        id="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select time</option>
                                        {timeSlots.map(time => (
                                            <option key={time} value={time}>
                                                {time}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="duration">Duration (minutes)</label>
                                    <select
                                        id="duration"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                    >
                                        <option value={15}>15 minutes</option>
                                        <option value={30}>30 minutes</option>
                                        <option value={45}>45 minutes</option>
                                        <option value={60}>1 hour</option>
                                        <option value={90}>1.5 hours</option>
                                        <option value={120}>2 hours</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="status">Status</label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        <option value="scheduled">Scheduled</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>Client Information</h3>
                            
                            <div className="form-group">
                                <label htmlFor="clientName">Client Name *</label>
                                <input
                                    type="text"
                                    id="clientName"
                                    name="clientName"
                                    value={formData.clientName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter client name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="clientEmail">Client Email *</label>
                                <input
                                    type="email"
                                    id="clientEmail"
                                    name="clientEmail"
                                    value={formData.clientEmail}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter client email"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="clientPhone">Client Phone</label>
                                <input
                                    type="tel"
                                    id="clientPhone"
                                    name="clientPhone"
                                    value={formData.clientPhone}
                                    onChange={handleChange}
                                    placeholder="Enter client phone number"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="notes">Notes</label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="Enter any additional notes"
                                    rows="4"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate('/appointments')}
                            className="btn btn-secondary"
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={saving}
                        >
                            {saving ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save"></i>
                                    Update Appointment
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAppointment;
