import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CreateAppointment.css';

const CreateAppointment = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: new Date(),
        time: '',
        duration: 15,
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        notes: '',
        status: 'scheduled'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Slot-wise booking state
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [slotsError, setSlotsError] = useState(null);

    useEffect(() => {
        fetchSlotsForDate(formData.date);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.date]);

    const fetchSlotsForDate = async (dateObj) => {
        try {
            setLoadingSlots(true);
            setSlotsError(null);
            const ymd = dateObj.toISOString().split('T')[0];
            const { data } = await axios.get(`http://localhost:5000/api/appointments/available`, {
                params: { date: ymd }
            });
            const slots = (data?.slots || []).map(s => s.startTime); // use startTime for selection
            setAvailableSlots(slots);
            // If previously selected time is no longer available, clear it
            if (!slots.includes(formData.time)) {
                setFormData(prev => ({ ...prev, time: '' }));
            }
        } catch (e) {
            console.error('Failed to fetch slots', e);
            setSlotsError('Failed to load available slots');
            setAvailableSlots([]);
        } finally {
            setLoadingSlots(false);
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
        setLoading(true);
        setError(null);

        try {
            const ymd = formData.date.toISOString().split('T')[0];
            // Slot-wise booking: book the selected 15-min slot
            const payload = {
                patientName: formData.clientName || formData.title || 'Patient',
                date: ymd,
                startTime: formData.time
            };
            const resp = await axios.post('http://localhost:5000/api/appointments/book', payload);
            if (resp.data?.success) {
                navigate('/appointments');
            } else {
                throw new Error(resp.data?.message || 'Booking failed');
            }
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Failed to book appointment';
            if (msg.toLowerCase().includes('slot already booked')) {
                setError('That slot was just booked. Please choose another.');
                // Refresh slots
                fetchSlotsForDate(formData.date);
            } else {
                setError(msg);
            }
            console.error('Error booking appointment:', err);
        } finally {
            setLoading(false);
        }
    };

    // Render
    return (
        <div className="create-appointment">
            <div className="container">
                <div className="header">
                    <h1>Create New Appointment</h1>
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
                                        minDate={new Date()}
                                        placeholderText="Select date"
                                        className="date-picker"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="time">Time (15-min slots) *</label>
                                    <select
                                        id="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        required
                                        disabled={loadingSlots}
                                    >
                                        <option value="">{loadingSlots ? 'Loading slots...' : 'Select time'}</option>
                                        {availableSlots.map(time => (
                                            <option key={time} value={time}>
                                                {format12h(time)}
                                            </option>
                                        ))}
                                    </select>
                                    {slotsError && (
                                        <div className="error-message" style={{ marginTop: '0.5rem' }}>
                                            {slotsError}
                                        </div>
                                    )}
                                    {!loadingSlots && availableSlots.length === 0 && (
                                        <div className="error-message" style={{ marginTop: '0.5rem' }}>
                                            No slots available for the selected date.
                                        </div>
                                    )}
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
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading || loadingSlots || !formData.time}
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Booking...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save"></i>
                                    Book Slot
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAppointment;

// Local helper to format HH:mm -> 12-hour label
function format12h(hhmm) {
    if (!hhmm || typeof hhmm !== 'string') return hhmm;
    const [h, m] = hhmm.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = (h % 12) || 12;
    return `${hour12.toString().padStart(1,'')}:${m.toString().padStart(2,'0')} ${ampm}`;
}
