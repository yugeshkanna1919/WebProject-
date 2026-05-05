import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import './AppointmentList.css';

const AppointmentList = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/appointments');
            setAppointments(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch appointments');
            console.error('Error fetching appointments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this appointment?')) {
            try {
                await axios.delete(`http://localhost:5000/api/appointments/${id}`);
                setAppointments(appointments.filter(appointment => appointment._id !== id));
            } catch (err) {
                setError('Failed to delete appointment');
                console.error('Error deleting appointment:', err);
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled': return 'status-scheduled';
            case 'confirmed': return 'status-confirmed';
            case 'cancelled': return 'status-cancelled';
            case 'completed': return 'status-completed';
            default: return 'status-scheduled';
        }
    };

    const filteredAppointments = appointments.filter(appointment => {
        const matchesSearch = appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            appointment.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="appointment-list">
                <div className="container">
                    <div className="loading">Loading appointments...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="appointment-list">
            <div className="container">
                <div className="header">
                    <h1>Appointments</h1>
                    <Link to="/appointments/create" className="btn btn-primary">
                        <i className="fas fa-plus"></i>
                        New Appointment
                    </Link>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="filters">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search appointments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <i className="fas fa-search search-icon"></i>
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="status-filter"
                    >
                        <option value="all">All Status</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                {filteredAppointments.length === 0 ? (
                    <div className="no-appointments">
                        <i className="fas fa-calendar-times"></i>
                        <h3>No appointments found</h3>
                        <p>Create your first appointment to get started!</p>
                        <Link to="/appointments/create" className="btn btn-primary">
                            Create Appointment
                        </Link>
                    </div>
                ) : (
                    <div className="appointments-grid">
                        {filteredAppointments.map(appointment => (
                            <div key={appointment._id} className="appointment-card">
                                <div className="appointment-header">
                                    <h3>{appointment.title}</h3>
                                    <span className={`status ${getStatusColor(appointment.status)}`}>
                                        {appointment.status}
                                    </span>
                                </div>
                                <div className="appointment-details">
                                    <p><i className="fas fa-user"></i> {appointment.clientName}</p>
                                    <p><i className="fas fa-envelope"></i> {appointment.clientEmail}</p>
                                    {appointment.clientPhone && (
                                        <p><i className="fas fa-phone"></i> {appointment.clientPhone}</p>
                                    )}
                                    <p><i className="fas fa-calendar"></i> {format(new Date(appointment.date), 'MMM dd, yyyy')}</p>
                                    <p><i className="fas fa-clock"></i> {formatTimeRange12h(appointment.time)}</p>
                                    <p><i className="fas fa-hourglass-half"></i> {appointment.duration} minutes</p>
                                </div>
                                {appointment.notes && (
                                    <div className="appointment-notes">
                                        <p><strong>Notes:</strong> {appointment.notes}</p>
                                    </div>
                                )}
                                <div className="appointment-actions">
                                    <Link to={`/appointments/edit/${appointment._id}`} className="btn btn-secondary">
                                        <i className="fas fa-edit"></i>
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(appointment._id)}
                                        className="btn btn-danger"
                                    >
                                        <i className="fas fa-trash"></i>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentList;
 
// Format a range like "09:00 - 09:15" to "9:00 AM - 9:15 AM"
function formatTimeRange12h(range) {
    if (!range || typeof range !== 'string' || !range.includes('-')) return range;
    const [start, end] = range.split('-').map(s => s.trim());
    return `${format12h(start)} - ${format12h(end)}`;
}

function format12h(hhmm) {
    const [h, m] = hhmm.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = (h % 12) || 12;
    return `${hour12}:${m.toString().padStart(2,'0')} ${ampm}`;
}
