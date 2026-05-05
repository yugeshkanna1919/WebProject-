import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <i className="fas fa-calendar-check"></i>
                    Appointment Manager
                </Link>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link to="/" className={`nav-link ${isActive('/')}`}>
                            <i className="fas fa-home"></i>
                            Home
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/appointments" className={`nav-link ${isActive('/appointments')}`}>
                            <i className="fas fa-list"></i>
                            Appointments
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/appointments/create" className={`nav-link ${isActive('/appointments/create')}`}>
                            <i className="fas fa-plus"></i>
                            New Appointment
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
