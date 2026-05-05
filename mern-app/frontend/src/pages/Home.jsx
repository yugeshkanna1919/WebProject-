import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home">
            <div className="hero-section">
                <div className="hero-content">
                    <h1>Welcome to Appointment Manager</h1>
                    <p className="hero-subtitle">
                        Streamline your scheduling process with our comprehensive appointment management system.
                        Book, manage, and track appointments with ease.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/appointments" className="btn btn-primary">
                            <i className="fas fa-list"></i>
                            View Appointments
                        </Link>
                        <Link to="/appointments/create" className="btn btn-secondary">
                            <i className="fas fa-plus"></i>
                            Create New Appointment
                        </Link>
                    </div>
                </div>
            </div>

            <div className="features-section">
                <div className="container">
                    <h2>Key Features</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-calendar-plus"></i>
                            </div>
                            <h3>Easy Scheduling</h3>
                            <p>Create appointments quickly with our intuitive interface</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-clock"></i>
                            </div>
                            <h3>Time Management</h3>
                            <p>Efficiently manage your time with smart scheduling tools</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-users"></i>
                            </div>
                            <h3>Client Management</h3>
                            <p>Keep track of client information and appointment history</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-chart-line"></i>
                            </div>
                            <h3>Analytics</h3>
                            <p>Get insights into your appointment patterns and trends</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;