import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from '../pages/Home';
import AppointmentList from '../pages/AppointmentList';
import CreateAppointment from '../pages/CreateAppointment';
import EditAppointment from '../pages/EditAppointment';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/appointments" element={<AppointmentList />} />
                        <Route path="/appointments/create" element={<CreateAppointment />} />
                        <Route path="/appointments/edit/:id" element={<EditAppointment />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;