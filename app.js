// Appointment Management System - Main JavaScript File
// Author: AI Assistant
// Description: Comprehensive appointment management system with local storage

// Central API base; override via window.API_BASE or localStorage.API_BASE
const API_BASE = (typeof window !== 'undefined' && window.API_BASE) ||
    (typeof localStorage !== 'undefined' && localStorage.getItem('API_BASE')) ||
    'http://localhost:5000';

class AppointmentManager {
    constructor() {
        this.appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        this.clients = JSON.parse(localStorage.getItem('clients')) || [];
        this.providers = JSON.parse(localStorage.getItem('providers')) || this.getDefaultProviders();
        this.settings = JSON.parse(localStorage.getItem('settings')) || this.getDefaultSettings();
        this.isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
        
        this.init();
    }

    init() {
        this.loadDemoData();
        this.bindEvents();
        this.updateDashboardStats();
        this.initializePage();
    }

    // Initialize page-specific functionality
    initializePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        switch(currentPage) {
            case 'index.html':
                this.initDashboard();
                break;
            case 'add-appointment.html':
                this.initAddAppointment();
                break;
            case 'appointments.html':
                this.initAppointmentsList();
                break;
            case 'calendar.html':
                this.initCalendar();
                break;
            case 'clients.html':
                this.initClients();
                break;
            case 'settings.html':
                this.initSettings();
                break;
        }
    }

    // Data Management
    loadDemoData() {
        if (this.appointments.length === 0) {
            this.appointments = this.getDemoAppointments();
            this.saveToStorage('appointments', this.appointments);
        }
        if (this.clients.length === 0) {
            this.clients = this.getDemoClients();
            this.saveToStorage('clients', this.clients);
        }
    }

    getDemoAppointments() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        return [
            {
                id: this.generateId(),
                clientName: 'Rajesh Kumar',
                clientEmail: 'rajesh.kumar@email.com',
                clientPhone: '+91-89-2345-6792',
                clientId: 'CLT001',
                date: this.formatDate(today),
                time: '09:00',
                duration: 30,
                type: 'checkup',
                provider: 'dr-johnson',
                location: 'main-office',
                status: 'confirmed',
                priority: 'normal',
                notes: 'Regular dental checkup and cleaning',
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                clientName: 'Meera Sundaram',
                clientEmail: 'meera.sundaram@email.com',
                clientPhone: '+91-91-2345-6790', 
                clientId: 'CLT002',
                date: this.formatDate(today),
                time: '11:30',
                duration: 20,
                type: 'consultation',
                provider: 'dr-chen',
                location: 'main-office',
                status: 'pending',
                priority: 'normal',
                notes: 'Initial consultation for treatment planning',
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                clientName: 'Suresh Murugan',
                clientEmail: 'suresh.murugan@email.com',
                clientPhone: '+91-89-2345-6791',
                clientId: 'CLT003',
                date: this.formatDate(today),
                time: '14:00',
                duration: 25,
                type: 'follow-up',
                provider: 'dr-wang',
                location: 'main-office',
                status: 'confirmed',
                priority: 'normal',
                notes: 'Follow-up appointment for treatment progress',
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                clientName: 'Lakshmi Selvan',
                clientEmail: 'lakshmi.selvan@email.com',
                clientPhone: '+91-89-2345-6792',
                clientId: 'CLT004',
                date: this.formatDate(tomorrow),
                time: '10:00',
                duration: 40,
                type: 'treatment',
                provider: 'dr-johnson',
                location: 'main-office',
                status: 'scheduled',
                priority: 'high',
                notes: 'Root canal treatment - second session',
                createdAt: new Date().toISOString()
            }
        ];
    }

    getDemoClients() {
        return [
            {
                id: 'CLT001',
                name: 'Rajesh Kumar',
                email: 'rajesh.kumar@email.com',
                phone: '+91-89-2345-6792',
                address: '123 Anna Salai, T. Nagar, Chennai 600017',
                dateOfBirth: '1985-06-15',
                gender: 'Male',
                emergencyContact: 'Deepa Kumar - +91-89-2345-6792',
                insuranceProvider: 'Health Insurance Co.',
                insuranceNumber: 'HIC123456789',
                status: 'active',
                emailVerified: true,
                notes: 'Regular patient, no allergies known',
                createdAt: '2023-01-15T09:00:00Z',
                lastVisit: '2024-01-15T09:00:00Z',
                totalAppointments: 12,
                upcomingAppointments: 1
            },
            {
                id: 'CLT002',
                name: 'Meera Sundaram',
                email: 'meera.sundaram@email.com',
                phone: '+91-91-2345-6790',
                address: '456 Race Course Road, Coimbatore 641018',
                dateOfBirth: '1992-03-22',
                gender: 'Female',
                emergencyContact: 'Ravi Sundaram - +91-89-2345-6790',
                insuranceProvider: 'Premium Health',
                insuranceNumber: 'PH987654321',
                status: 'new',
                emailVerified: false,
                verificationCode: '123456',
                notes: 'New patient, allergic to penicillin',
                createdAt: '2024-01-10T14:30:00Z',
                lastVisit: null,
                totalAppointments: 0,
                upcomingAppointments: 1
            },
            {
                id: 'CLT003',
                name: 'Suresh Murugan',
                email: 'suresh.murugan@email.com',
                phone: '+91-89-2345-6791',
                address: '789 West Masi Street, Madurai 625001',
                dateOfBirth: '1978-11-08',
                gender: 'Male',
                emergencyContact: 'Padma Murugan - +91-89-2345-6791',
                insuranceProvider: 'Care Plus',
                insuranceNumber: 'CP456789123',
                status: 'active',
                emailVerified: true,
                notes: 'Diabetic patient, requires special care',
                createdAt: '2023-05-20T11:15:00Z',
                lastVisit: '2023-12-20T14:00:00Z',
                totalAppointments: 8,
                upcomingAppointments: 1
            },
            {
                id: 'CLT004',
                name: 'Lakshmi Selvan',
                email: 'lakshmi.selvan@email.com',
                phone: '+91-89-2345-6792',
                address: '321 Junction Road, Salem 636001',
                dateOfBirth: '1990-09-12',
                gender: 'Female',
                emergencyContact: 'Krishnan Selvan - +91-89-2345-6792',
                insuranceProvider: 'Universal Health',
                insuranceNumber: 'UH789123456',
                status: 'active',
                emailVerified: false,
                verificationCode: '789012',
                notes: 'Ongoing treatment for root canal',
                createdAt: '2023-08-10T16:20:00Z',
                lastVisit: '2024-01-10T10:00:00Z',
                totalAppointments: 6,
                upcomingAppointments: 1
            }
        ];
    }

    getDefaultProviders() {
        return [
            {
                id: 'CBT001',
                name: 'Dr. Priya Raman',
                specialty: 'General Dentistry',
                email: 'priya.raman@clinic.com',
                        phone: '+91-89-2345-6789',
                schedule: {
                    monday: { start: '09:00', end: '17:00' },
                    tuesday: { start: '09:00', end: '17:00' },
                    wednesday: { start: '09:00', end: '17:00' },
                    thursday: { start: '09:00', end: '17:00' },
                    friday: { start: '09:00', end: '15:00' },
                    saturday: { start: '09:00', end: '13:00' },
                    sunday: { start: null, end: null }
                }
            },
            {
                id: 'CBT002',
                name: 'Dr. Rajesh Iyer',
                specialty: 'Orthodontics',
                email: 'rajesh.iyer@clinic.com',
                phone: '+91-89-2345-6790',
                schedule: {
                    monday: { start: '08:00', end: '16:00' },
                    tuesday: { start: '08:00', end: '16:00' },
                    wednesday: { start: '08:00', end: '16:00' },
                    thursday: { start: '08:00', end: '16:00' },
                    friday: { start: '08:00', end: '14:00' },
                    saturday: { start: null, end: null },
                    sunday: { start: null, end: null }
                }
            },
            {
                id: 'CBT003',
                name: 'Dr. Anjali Kumar',
                specialty: 'Oral Surgery',
                email: 'anjali.kumar@clinic.com',
                phone: '+91-89-2345-6791',
                schedule: {
                    monday: { start: '10:00', end: '18:00' },
                    tuesday: { start: '10:00', end: '18:00' },
                    wednesday: { start: '10:00', end: '18:00' },
                    thursday: { start: '10:00', end: '18:00' },
                    friday: { start: '10:00', end: '16:00' },
                    saturday: { start: null, end: null },
                    sunday: { start: null, end: null }
                }
            },
            {
                    id: 'CBT004',
                name: 'Dr. Vikram Sundaram',
                specialty: 'Periodontics',
                email: 'vikram.sundaram@clinic.com',
                phone: '+91-89-2345-6792',
                schedule: {
                    monday: { start: '09:00', end: '17:00' },
                    tuesday: { start: '09:00', end: '17:00' },
                    wednesday: { start: '09:00', end: '17:00' },
                    thursday: { start: '09:00', end: '17:00' },
                    friday: { start: '09:00', end: '15:00' },
                    saturday: { start: '09:00', end: '13:00' },
                    sunday: { start: null, end: null }
                }
            }
        ];
    }

    getDefaultSettings() {
        return {
            clinicName: 'ABHI SK ',
            address: '123 Anna Salai, T. Nagar, Chennai 600017',
            phone: '+91-89-2345-6789',
            email: 'info@bharatscheduler.com',
            workingHours: {
                monday: { start: '08:00', end: '18:00' },
                tuesday: { start: '08:00', end: '18:00' },
                wednesday: { start: '08:00', end: '18:00' },
                thursday: { start: '08:00', end: '18:00' },
                friday: { start: '08:00', end: '16:00' },
                saturday: { start: '09:00', end: '13:00' },
                sunday: { start: null, end: null }
            },
            appointmentDuration: 30,
            notifications: {
                email: true,
                sms: false,
                reminderTime: 24
            },
            theme: 'light',
            language: 'en'
        };
    }

    // Event Binding
    bindEvents() {
        document.addEventListener('DOMContentLoaded', () => {
            this.bindGlobalEvents();
        });
    }

    bindGlobalEvents() {
        // Search functionality
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Navigation active state
        this.updateActiveNavigation();

        // Modal events
        this.bindModalEvents();
    }

    updateActiveNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-links li');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.querySelector('a')?.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            }
        });
    }

    bindModalEvents() {
        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });

        // Close modal with close button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close')) {
                const modal = e.target.closest('.modal');
                this.closeModal(modal);
            }
        });

        // Handle cancel button for new client (redirect to previous page)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('client-cancel-new')) {
                // Go back to previous page
                window.history.back();
            }
        });

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal[style*="flex"]');
                if (openModal) {
                    this.closeModal(openModal);
                }
            }
        });
    }

    // Dashboard Functions
    initDashboard() {
        this.updateDashboardStats();
        this.loadTodaysAppointments();
        this.loadRecentActivity();
        this.bindDashboardEvents();
    }

    updateDashboardStats() {
        const today = this.formatDate(new Date());
        const todayAppointments = this.appointments.filter(apt => apt.date === today);
        const pendingAppointments = this.appointments.filter(apt => apt.status === 'pending');
        const completedAppointments = this.appointments.filter(apt => apt.status === 'completed');
        const totalClients = this.clients.length;

        // Update stat cards if they exist
        const statCards = document.querySelectorAll('.stat-card');
        if (statCards.length >= 4) {
            statCards[0].querySelector('.stat-number').textContent = todayAppointments.length;
            statCards[1].querySelector('.stat-number').textContent = pendingAppointments.length;
            statCards[2].querySelector('.stat-number').textContent = completedAppointments.length;
            statCards[3].querySelector('.stat-number').textContent = totalClients;
        }
    }

    loadTodaysAppointments() {
        const today = this.formatDate(new Date());
        const todayAppointments = this.appointments
            .filter(apt => apt.date === today)
            .sort((a, b) => a.time.localeCompare(b.time));

        const appointmentsList = document.querySelector('.appointments-list');
        if (appointmentsList) {
            appointmentsList.innerHTML = todayAppointments.map(apt => 
                this.renderAppointmentItem(apt)
            ).join('');
        }
    }

    loadRecentActivity() {
        const activities = [
            {
                icon: 'fas fa-calendar-plus',
                text: 'New appointment scheduled for Dr. Raman tomorrow at 10:00 AM',
                time: '2 hours ago'
            },
            {
                icon: 'fas fa-user-plus',
                text: 'New client Lakshmi Selvan added to the system',
                time: '4 hours ago'
            },
            {
                icon: 'fas fa-calendar-check',
                text: 'Appointment completed with Dr. Iyer for patient Rajesh Kumar',
                time: '6 hours ago'
            }
        ];

        const activityList = document.querySelector('.activity-list');
        if (activityList) {
            activityList.innerHTML = activities.map(activity => `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="${activity.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <p><strong>${activity.text.split(' ')[0]} ${activity.text.split(' ')[1]}</strong> ${activity.text.split(' ').slice(2).join(' ')}</p>
                        <span class="activity-time">${activity.time}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    bindDashboardEvents() {
        // Bind edit and delete buttons for appointments
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-icon')) {
                const appointmentItem = e.target.closest('.appointment-item');
                const appointmentId = appointmentItem?.dataset.appointmentId;
                
                if (e.target.closest('.fa-edit')) {
                    this.editAppointment(appointmentId);
                } else if (e.target.closest('.fa-trash')) {
                    this.deleteAppointment(appointmentId);
                }
            }
        });
    }

    renderAppointmentItem(appointment) {
        const provider = this.providers.find(p => p.id === appointment.provider);
        const providerName = provider ? provider.name : 'Unknown Provider';
        
        return `
            <div class="appointment-item" data-appointment-id="${appointment.id}">
                <div class="appointment-time">
                    <span class="time">${this.formatTime(appointment.time)}</span>
                    <span class="duration">${appointment.duration} min</span>
                </div>
                <div class="appointment-details">
                    <h4>${providerName} - ${this.formatAppointmentType(appointment.type)}</h4>
                    <p>Patient: ${appointment.clientName}</p>
                    <span class="status ${appointment.status}">${this.formatStatus(appointment.status)}</span>
                </div>
                <div class="appointment-actions">
                    <button class="btn-icon" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // Add Appointment Functions
    initAddAppointment() {
        this.populateProviders();
        this.generateClientId();
        this.bindAddAppointmentEvents();

        // Load 15-min slots for selected date from backend
        const dateInput = document.getElementById('appointment-date');
        const timeSelect = document.getElementById('appointment-time');
        if (dateInput && timeSelect) {
            const loadSlots = async () => {
                const ymd = dateInput.value;
                if (!ymd) return;
                try {
                    timeSelect.disabled = true;
                    timeSelect.innerHTML = '<option value="">Loading slots...</option>';
                    const res = await fetch(`${API_BASE}/api/appointments/available?date=${encodeURIComponent(ymd)}&t=${Date.now()}`, {
                        headers: { 'Cache-Control': 'no-cache' }
                    });
                    if (!res.ok) {
                        throw new Error(`HTTP ${res.status}`);
                    }
                    const data = await res.json();
                    const slots = (data && data.slots) ? data.slots : [];
                    if (!Array.isArray(slots) || slots.length === 0) {
                        timeSelect.innerHTML = '<option value="">No slots available</option>';
                        return;
                    }
                    timeSelect.innerHTML = '<option value="">Select time</option>' +
                        slots.map(s => {
                            const t = s.startTime;
                            return `<option value="${t}">${AppointmentManager.prototype.formatTime(t)}</option>`;
                        }).join('');
                } catch (e) {
                    console.error('Failed to load slots', e);
                    timeSelect.innerHTML = '<option value="">Failed to load slots</option>';
                } finally {
                    timeSelect.disabled = false;
                }
            };

            // Set min date to today and initial value
            const today = this.formatDate(new Date());
            dateInput.min = today;
            if (!dateInput.value) dateInput.value = today;

            loadSlots();
            dateInput.addEventListener('change', loadSlots);
        }
    }

    populateProviders() {
        const providerSelect = document.getElementById('provider');
        if (providerSelect) {
            providerSelect.innerHTML = '<option value="">Select provider</option>' +
                this.providers.map(provider => 
                    `<option value="${provider.id}">${provider.name}</option>`
                ).join('');
        }
    }

    generateClientId() {
        const clientIdInput = document.getElementById('client-id');
        if (clientIdInput) {
            const nextId = 'CLT' + String(this.clients.length + 1).padStart(3, '0');
            clientIdInput.value = nextId;
        }
    }

    bindAddAppointmentEvents() {
        const form = document.querySelector('.appointment-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveAppointment();
            });

            // Auto-populate client info if exists
            const clientNameInput = document.getElementById('client-name');
            if (clientNameInput) {
                clientNameInput.addEventListener('blur', () => {
                    this.autoPopulateClientInfo(clientNameInput.value);
                });
            }

            // Set minimum date to today
            const dateInput = document.getElementById('appointment-date');
            if (dateInput) {
                dateInput.min = this.formatDate(new Date());
            }
        }

        // Cancel button
        const cancelBtn = document.querySelector('.btn-secondary');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
                    window.location.href = 'index.html';
                }
            });
        }
    }

    autoPopulateClientInfo(clientName) {
        const existingClient = this.clients.find(c => 
            c.name.toLowerCase() === clientName.toLowerCase()
        );

        if (existingClient) {
            document.getElementById('client-email').value = existingClient.email || '';
            document.getElementById('client-phone').value = existingClient.phone || '';
            document.getElementById('client-id').value = existingClient.id;
        }
    }

    async saveAppointment() {
        const formData = new FormData(document.querySelector('.appointment-form'));
        const appointmentData = Object.fromEntries(formData.entries());

        // Validation
        if (!this.validateAppointmentForm(appointmentData)) {
            return;
        }

        // Enforce 15-min slot booking via backend first
        try {
            const payload = {
                patientName: appointmentData.clientName,
                date: appointmentData.appointmentDate,
                startTime: appointmentData.appointmentTime
            };
            const res = await fetch(`${API_BASE}/api/appointments/book`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.message || 'Failed to book slot');
            }

            // Create local appointment record for UI continuity
            const appointment = {
                id: this.generateId(),
                clientName: appointmentData.clientName,
                clientEmail: appointmentData.clientEmail,
                clientPhone: appointmentData.clientPhone,
                clientId: appointmentData.clientId,
                date: appointmentData.appointmentDate,
                time: appointmentData.appointmentTime,
                duration: 15,
                type: appointmentData.appointmentType,
                provider: appointmentData.provider,
                location: appointmentData.location,
                status: appointmentData.status || 'scheduled',
                priority: appointmentData.priority || 'normal',
                notes: appointmentData.notes || '',
                createdAt: new Date().toISOString()
            };

            this.appointments.push(appointment);
            this.saveToStorage('appointments', this.appointments);
            this.addClientIfNew(appointmentData);
            this.showNotification('Appointment booked successfully!', 'success');
            setTimeout(() => {
                window.location.href = 'appointments.html';
            }, 1000);
        } catch (err) {
            const msg = (err && err.message) ? err.message : 'Failed to book slot';
            if (msg.toLowerCase().includes('slot already booked')) {
                this.showNotification('Selected slot is already booked. Please choose another slot.', 'error');
            } else {
                this.showNotification(msg, 'error');
            }
        }
    }

    validateAppointmentForm(data) {
        const required = ['clientName', 'appointmentDate', 'appointmentTime', 'duration', 'appointmentType', 'provider'];
        const missing = required.filter(field => !data[field]);

        if (missing.length > 0) {
            this.showNotification(`Please fill in all required fields: ${missing.join(', ')}`, 'error');
            return false;
        }

        // Check for time conflicts
        if (this.hasTimeConflict(data.appointmentDate, data.appointmentTime, data.duration, data.provider)) {
            this.showNotification('Time conflict detected with another appointment', 'error');
            return false;
        }

        return true;
    }

    hasTimeConflict(date, time, duration, providerId) {
        const existingAppointments = this.appointments.filter(apt => 
            apt.date === date && apt.provider === providerId && apt.status !== 'cancelled'
        );

        const newStart = this.timeToMinutes(time);
        const newEnd = newStart + parseInt(duration);

        return existingAppointments.some(apt => {
            const existingStart = this.timeToMinutes(apt.time);
            const existingEnd = existingStart + apt.duration;
            
            return (newStart < existingEnd && newEnd > existingStart);
        });
    }

    addClientIfNew(appointmentData) {
        const existingClient = this.clients.find(c => c.id === appointmentData.clientId);
        
        if (!existingClient) {
            const newClient = {
                id: appointmentData.clientId,
                name: appointmentData.clientName,
                email: appointmentData.clientEmail || '',
                phone: appointmentData.clientPhone || '',
                status: 'new',
                emailVerified: false,
                verificationCode: AppointmentUtils.generateVerificationCode(),
                createdAt: new Date().toISOString(),
                totalAppointments: 1,
                upcomingAppointments: 1,
                notes: ''
            };
            
            this.clients.push(newClient);
            this.saveToStorage('clients', this.clients);
            
            // Send verification email if email is provided
            if (appointmentData.clientEmail) {
                this.sendVerificationEmail(newClient);
            }
        }
    }

    async sendVerificationEmail(client) {
        try {
            const result = await AppointmentUtils.verifyEmail(client.email);
            if (result.success) {
                this.showNotification(`Verification email sent to ${client.email}`, 'success');
            } else {
                this.showNotification(`Failed to send verification email to ${client.email}`, 'error');
            }
        } catch (error) {
            this.showNotification('Error sending verification email', 'error');
        }
    }

    async verifyClientEmail(clientId, verificationCode) {
        const client = this.clients.find(c => c.id === clientId);
        if (!client) {
            this.showNotification('Client not found', 'error');
            return false;
        }

        if (client.verificationCode === verificationCode) {
            client.emailVerified = true;
            client.verificationCode = null; // Clear the code after verification
            this.saveToStorage('clients', this.clients);
            this.showNotification('Email verified successfully!', 'success');
            return true;
        } else {
            this.showNotification('Invalid verification code', 'error');
            return false;
        }
    }

    // Appointments List Functions
    initAppointmentsList() {
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.currentFilters = {};
        
        this.loadAppointmentsList();
        this.bindAppointmentsListEvents();
        this.setupFilters();
    }

    loadAppointmentsList() {
        const filteredAppointments = this.getFilteredAppointments();
        const paginatedAppointments = this.getPaginatedAppointments(filteredAppointments);
        
        this.renderAppointmentsTable(paginatedAppointments);
        this.renderPagination(filteredAppointments.length);
    }

    getFilteredAppointments() {
        let filtered = [...this.appointments];

        // Apply filters
        if (this.currentFilters.status) {
            filtered = filtered.filter(apt => apt.status === this.currentFilters.status);
        }
        if (this.currentFilters.provider) {
            filtered = filtered.filter(apt => apt.provider === this.currentFilters.provider);
        }
        if (this.currentFilters.type) {
            filtered = filtered.filter(apt => apt.type === this.currentFilters.type);
        }
        if (this.currentFilters.dateFrom) {
            filtered = filtered.filter(apt => apt.date >= this.currentFilters.dateFrom);
        }
        if (this.currentFilters.dateTo) {
            filtered = filtered.filter(apt => apt.date <= this.currentFilters.dateTo);
        }

        // Sort by date and time
        return filtered.sort((a, b) => {
            if (a.date !== b.date) {
                return new Date(a.date) - new Date(b.date);
            }
            return a.time.localeCompare(b.time);
        });
    }

    getPaginatedAppointments(appointments) {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        return appointments.slice(startIndex, startIndex + this.itemsPerPage);
    }

    renderAppointmentsTable(appointments) {
        const tableBody = document.querySelector('.appointments-table tbody');
        if (!tableBody) return;

        tableBody.innerHTML = appointments.map(appointment => {
            const provider = this.providers.find(p => p.id === appointment.provider);
            const providerName = provider ? provider.name : 'Unknown Provider';

            return `
                <tr data-appointment-id="${appointment.id}">
                    <td>
                        <div class="datetime-cell">
                            <span class="date">${this.formatDateDisplay(appointment.date)}</span>
                            <span class="time">${this.formatTime(appointment.time)}</span>
                        </div>
                    </td>
                    <td>
                        <div class="client-cell">
                            <span class="client-name">${appointment.clientName}</span>
                            <span class="client-email">${appointment.clientEmail || 'No email'}</span>
                        </div>
                    </td>
                    <td>${providerName}</td>
                    <td>
                        <span class="appointment-type ${appointment.type}">${this.formatAppointmentType(appointment.type)}</span>
                    </td>
                    <td>${appointment.duration} min</td>
                    <td>
                        <span class="status ${appointment.status}">${this.formatStatus(appointment.status)}</span>
                    </td>
                    <td>
                        <div class="table-actions">
                            <button class="btn-icon" onclick="appointmentManager.editAppointment('${appointment.id}')" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon" onclick="appointmentManager.deleteAppointment('${appointment.id}')" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                            <button class="btn-icon" onclick="appointmentManager.viewAppointment('${appointment.id}')" title="View">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    setupFilters() {
        // Populate filter selects
        this.populateFilterSelects();
        
        // Bind filter events
        document.addEventListener('change', (e) => {
            if (e.target.matches('.filter-group select, .filter-group input')) {
                this.updateFilters();
            }
        });
    }

    populateFilterSelects() {
        const statusFilter = document.getElementById('status-filter');
        const providerFilter = document.getElementById('provider-filter');
        const typeFilter = document.getElementById('type-filter');

        if (statusFilter) {
            statusFilter.innerHTML = `
                <option value="">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
            `;
        }

        if (providerFilter) {
            providerFilter.innerHTML = '<option value="">All Providers</option>' +
                this.providers.map(provider => 
                    `<option value="${provider.id}">${provider.name}</option>`
                ).join('');
        }

        if (typeFilter) {
            typeFilter.innerHTML = `
                <option value="">All Types</option>
                <option value="consultation">Consultation</option>
                <option value="checkup">Checkup</option>
                <option value="treatment">Treatment</option>
                <option value="follow-up">Follow-up</option>
                <option value="emergency">Emergency</option>
            `;
        }
    }

    updateFilters() {
        this.currentFilters = {
            status: document.getElementById('status-filter')?.value || '',
            provider: document.getElementById('provider-filter')?.value || '',
            type: document.getElementById('type-filter')?.value || '',
            dateFrom: document.getElementById('date-from')?.value || '',
            dateTo: document.getElementById('date-to')?.value || ''
        };

        this.currentPage = 1;
        this.loadAppointmentsList();
    }

    bindAppointmentsListEvents() {
        // Add appointment button
        const addBtn = document.querySelector('.btn-primary');
        if (addBtn && addBtn.textContent.includes('Add')) {
            addBtn.addEventListener('click', () => {
                window.location.href = 'add-appointment.html';
            });
        }
    }

    renderPagination(totalItems) {
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        const paginationControls = document.querySelector('.pagination-controls');
        const paginationInfo = document.querySelector('.pagination-info');

        if (paginationInfo) {
            const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
            const endItem = Math.min(this.currentPage * this.itemsPerPage, totalItems);
            paginationInfo.textContent = `Showing ${startItem}-${endItem} of ${totalItems} appointments`;
        }

        if (paginationControls) {
            const pageNumbers = this.generatePageNumbers(totalPages);
            paginationControls.innerHTML = `
                <button class="page-btn" ${this.currentPage === 1 ? 'disabled' : ''} onclick="appointmentManager.changePage(${this.currentPage - 1})">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <div class="page-numbers">
                    ${pageNumbers.map(page => `
                        <button class="page-btn ${page === this.currentPage ? 'active' : ''}" 
                                onclick="appointmentManager.changePage(${page})">${page}</button>
                    `).join('')}
                </div>
                <button class="page-btn" ${this.currentPage === totalPages ? 'disabled' : ''} onclick="appointmentManager.changePage(${this.currentPage + 1})">
                    <i class="fas fa-chevron-right"></i>
                </button>
            `;
        }
    }

    generatePageNumbers(totalPages) {
        const pages = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const half = Math.floor(maxVisible / 2);
            let start = Math.max(1, this.currentPage - half);
            let end = Math.min(totalPages, start + maxVisible - 1);
            
            if (end - start < maxVisible - 1) {
                start = Math.max(1, end - maxVisible + 1);
            }
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
        }
        
        return pages;
    }

    changePage(page) {
        const totalPages = Math.ceil(this.getFilteredAppointments().length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.loadAppointmentsList();
        }
    }

    // Calendar Functions
    initCalendar() {
        this.currentDate = new Date();
        this.renderCalendar();
        this.bindCalendarEvents();
    }

    renderCalendar() {
        this.renderCalendarHeader();
        this.renderCalendarGrid();
        this.renderCalendarSidebar();
    }

    renderCalendarHeader() {
        const calendarControls = document.querySelector('.calendar-controls h2');
        if (calendarControls) {
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
            calendarControls.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        }
    }

    renderCalendarGrid() {
        const calendarGrid = document.querySelector('.calendar-grid');
        if (!calendarGrid) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Get first day of month and last day
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        let html = '';
        let currentDate = new Date(startDate);

        // Generate 6 weeks (42 days)
        for (let week = 0; week < 6; week++) {
            for (let day = 0; day < 7; day++) {
                const isCurrentMonth = currentDate.getMonth() === month;
                const isToday = this.isToday(currentDate);
                const dayAppointments = this.getAppointmentsForDate(currentDate);

                html += `
                    <div class="calendar-day ${!isCurrentMonth ? (currentDate < firstDay ? 'prev-month' : 'next-month') : ''} ${isToday ? 'today' : ''}"
                         data-date="${this.formatDate(currentDate)}">
                        <div class="day-number">${currentDate.getDate()}</div>
                        <div class="appointments">
                            ${dayAppointments.map(apt => `
                                <div class="appointment-dot ${apt.status}" 
                                     title="${apt.clientName} - ${this.formatTime(apt.time)}"></div>
                            `).join('')}
                        </div>
                    </div>
                `;
                
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        calendarGrid.innerHTML = html;
    }

    getAppointmentsForDate(date) {
        const dateStr = this.formatDate(date);
        return this.appointments.filter(apt => apt.date === dateStr);
    }

    renderCalendarSidebar() {
        // This would render a sidebar with today's appointments
        // Implementation depends on your HTML structure
    }

    bindCalendarEvents() {
        // Previous/Next month buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.calendar-prev')) {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.renderCalendar();
            } else if (e.target.matches('.calendar-next')) {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.renderCalendar();
            } else if (e.target.closest('.calendar-day')) {
                const dayElement = e.target.closest('.calendar-day');
                const date = dayElement.dataset.date;
                this.showDayAppointments(date);
            }
        });
    }

    showDayAppointments(date) {
        const appointments = this.getAppointmentsForDate(new Date(date));
        // Show modal or sidebar with day's appointments
        console.log('Appointments for', date, appointments);
    }

    // Client Management Functions
    initClients() {
        this.loadClientsList();
        this.bindClientsEvents();
    }

    loadClientsList() {
        const clientsGrid = document.querySelector('.clients-grid');
        if (!clientsGrid) return;

        clientsGrid.innerHTML = this.clients.map(client => this.renderClientCard(client)).join('');
    }

    renderClientCard(client) {
        const avatarImages = [
            'images/client-avatar-1.svg',
            'images/client-avatar-2.svg', 
            'images/client-avatar-3.svg',
            'images/user-avatar.svg'
        ];
        const avatarIndex = client.id.charCodeAt(client.id.length - 1) % avatarImages.length;
        const avatarSrc = avatarImages[avatarIndex];
        
        return `
            <div class="client-card" data-client-id="${client.id}">
                <div class="client-header">
                    <div class="client-avatar">
                        <img src="${avatarSrc}" alt="${client.name}">
                    </div>
                    <span class="client-status ${client.status}">${this.formatStatus(client.status)}</span>
                </div>
                <div class="client-info">
                    <h3>${client.name}</h3>
                    <p class="client-email">
                        ${client.email}
                        ${client.emailVerified ? 
                            '<span class="email-verified" title="Email Verified"><i class="fas fa-check-circle"></i></span>' : 
                            '<span class="email-unverified" title="Email Not Verified"><i class="fas fa-exclamation-circle"></i></span>'
                        }
                    </p>
                    <p class="client-phone">${client.phone}</p>
                </div>
                <div class="client-stats">
                    <div class="stat-item">
                        <span class="stat-label">Total</span>
                        <span class="stat-value">${client.totalAppointments || 0}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Upcoming</span>
                        <span class="stat-value">${client.upcomingAppointments || 0}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Status</span>
                        <span class="stat-value">${client.status}</span>
                    </div>
                </div>
                <div class="client-actions">
                    <button class="btn-icon" onclick="appointmentManager.editClient('${client.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="appointmentManager.viewClient('${client.id}')" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="appointmentManager.scheduleAppointment('${client.id}')" title="Schedule">
                        <i class="fas fa-calendar-plus"></i>
                    </button>
                </div>
            </div>
        `;
    }

    bindClientsEvents() {
        // Add client button
        const addClientBtn = document.querySelector('.btn-primary');
        if (addClientBtn && addClientBtn.textContent.includes('Add')) {
            addClientBtn.addEventListener('click', () => {
                this.showAddClientModal();
            });
        }
    }

    showAddClientModal() {
        // Create and show modal for adding new client
        this.showClientModal();
    }

    showClientModal(clientId = null) {
        const client = clientId ? this.clients.find(c => c.id === clientId) : null;
        const isEdit = !!client;
        const isAddNew = !clientId;

        const modalHtml = `
            <div class="modal" id="clientModal" style="display: flex;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${isEdit ? 'Edit Client' : 'Add New Client'}</h2>
                        <button class="modal-close">&times;</button>
                    </div>
                    <form class="client-form">
                        <div class="form-grid">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="client-name">Full Name *</label>
                                    <input type="text" id="client-name" name="name" value="${client?.name || ''}" required>
                                </div>
                                <div class="form-group">
                                    <label for="client-email">Email *</label>
                                    <div class="email-input-group">
                                        <input type="email" id="client-email" name="email" value="${client?.email || ''}" required placeholder="example@email.com">
                                        ${client?.email && !client?.emailVerified ? 
                                            `<button type="button" class="btn btn-small btn-primary" onclick="appointmentManager.sendVerificationEmail({id: '${client.id}', email: '${client.email}'})">
                                                <i class="fas fa-paper-plane"></i> Verify
                                            </button>` : ''
                                        }
                                    </div>
                                    ${client?.email && !client?.emailVerified ? 
                                        '<div class="verification-section"><label for="verification-code">Verification Code</label><input type="text" id="verification-code" placeholder="Enter 6-digit code"><button type="button" class="btn btn-small btn-success" onclick="appointmentManager.verifyClientEmail(\'' + client.id + '\', document.getElementById(\'verification-code\').value)">Verify</button></div>' : ''
                                    }
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="client-phone">Phone *</label>
                                    <input type="tel" id="client-phone" name="phone" value="${client?.phone || ''}" required placeholder="+91-XX-XXXX-XXXX">
                                </div>
                                <div class="form-group">
                                    <label for="client-status">Status</label>
                                    <select id="client-status" name="status">
                                        <option value="active" ${client?.status === 'active' ? 'selected' : ''}>Active</option>
                                        <option value="inactive" ${client?.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                                        <option value="new" ${client?.status === 'new' ? 'selected' : ''}>New</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="client-address">Address</label>
                                <textarea id="client-address" name="address" rows="2">${client?.address || ''}</textarea>
                            </div>
                            <div class="form-group">
                                <label for="client-notes">Notes</label>
                                <textarea id="client-notes" name="notes" rows="3">${client?.notes || ''}</textarea>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary ${isAddNew ? 'client-cancel-new' : 'modal-close'}">Cancel</button>
                            <button type="submit" class="btn btn-primary">
                                ${isEdit ? 'Update Client' : 'Add Client'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Remove existing modal
        const existingModal = document.getElementById('clientModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Bind form submit
        const form = document.querySelector('#clientModal .client-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveClient(clientId);
        });
    }

    saveClient(clientId = null) {
        const form = document.querySelector('#clientModal .client-form');
        const formData = new FormData(form);
        const clientData = Object.fromEntries(formData.entries());

        // Validate required fields
        if (!clientData.name.trim()) {
            this.showNotification('Client name is required', 'error');
            return;
        }

        if (!clientData.email.trim()) {
            this.showNotification('Email address is required', 'error');
            return;
        }

        if (!AppointmentUtils.validateEmail(clientData.email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        if (!clientData.phone.trim()) {
            this.showNotification('Phone number is required', 'error');
            return;
        }

        // Validate Indian phone number format
        if (!AppointmentUtils.validateIndianPhone(clientData.phone)) {
            this.showNotification('Please enter a valid Indian phone number (e.g., +91-XX-XXXX-XXXX)', 'error');
            return;
        }

        if (clientId) {
            // Update existing client
            const clientIndex = this.clients.findIndex(c => c.id === clientId);
            if (clientIndex !== -1) {
                this.clients[clientIndex] = { ...this.clients[clientIndex], ...clientData };
            }
        } else {
            // Add new client
            const newClient = {
                id: this.generateId('CLT'),
                ...clientData,
                emailVerified: false,
                verificationCode: AppointmentUtils.generateVerificationCode(),
                createdAt: new Date().toISOString(),
                totalAppointments: 0,
                upcomingAppointments: 0
            };
            this.clients.push(newClient);
            
            // Send verification email if email is provided
            if (clientData.email) {
                this.sendVerificationEmail(newClient);
            }
        }

        this.saveToStorage('clients', this.clients);
        this.closeModal(document.getElementById('clientModal'));
        this.loadClientsList();
        this.showNotification(`Client ${clientId ? 'updated' : 'added'} successfully!`, 'success');
        
        // Redirect to client management page after adding new client
        if (!clientId) {
            setTimeout(() => {
                window.location.href = 'clients.html';
            }, 1500); // Wait 1.5 seconds to show the success notification
        }
    }

    editClient(clientId) {
        this.showClientModal(clientId);
    }

    viewClient(clientId) {
        const client = this.clients.find(c => c.id === clientId);
        if (client) {
            // Show detailed client information
            console.log('View client:', client);
        }
    }

    scheduleAppointment(clientId) {
        // Redirect to add appointment page with client pre-filled
        window.location.href = `add-appointment.html?client=${clientId}`;
    }

    // Settings Functions
    initSettings() {
        // Check admin access first
        if (!this.isAdminLoggedIn) {
            this.showAccessDenied();
            return;
        }
        
        this.showSettingsContent();
        this.loadSettings();
        this.bindSettingsEvents();
    }

    showAccessDenied() {
        const accessDenied = document.getElementById('access-denied');
        const settingsContent = document.getElementById('settings-content');
        
        if (accessDenied) accessDenied.style.display = 'flex';
        if (settingsContent) settingsContent.style.display = 'none';
    }

    showSettingsContent() {
        const accessDenied = document.getElementById('access-denied');
        const settingsContent = document.getElementById('settings-content');
        
        if (accessDenied) accessDenied.style.display = 'none';
        if (settingsContent) settingsContent.style.display = 'block';
    }

    loadSettings() {
        // Populate settings form with current values
        const settingsForm = document.querySelector('.settings-form');
        if (!settingsForm) return;

        // Populate form fields with current settings
        Object.keys(this.settings).forEach(key => {
            const input = settingsForm.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = this.settings[key];
            }
        });
    }

    bindSettingsEvents() {
        const settingsForm = document.querySelector('.settings-form');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveSettings();
            });
        }
    }

    saveSettings() {
        const form = document.querySelector('.settings-form');
        const formData = new FormData(form);
        const newSettings = Object.fromEntries(formData.entries());

        this.settings = { ...this.settings, ...newSettings };
        this.saveToStorage('settings', this.settings);
        this.showNotification('Settings saved successfully!', 'success');
    }

    // Admin Authentication Functions
    showAdminLogin() {
        const modalHtml = `
            <div class="modal admin-login-modal" id="adminLoginModal" style="display: flex;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Admin Login</h2>
                        <button class="modal-close">&times;</button>
                    </div>
                    <form class="admin-login-form" id="adminLoginForm">
                        <div id="login-message"></div>
                        <div class="form-group">
                            <label for="admin-username">Username</label>
                            <input type="text" id="admin-username" name="username" required placeholder="Enter admin username">
                        </div>
                        <div class="form-group">
                            <label for="admin-password">Password</label>
                            <input type="password" id="admin-password" name="password" required placeholder="Enter admin password">
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary modal-close">Cancel</button>
                            <button type="submit" class="btn btn-primary">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Remove existing modal
        const existingModal = document.getElementById('adminLoginModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Bind form submit
        const form = document.querySelector('#adminLoginForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.authenticateAdmin();
        });
    }

    authenticateAdmin() {
        const form = document.querySelector('#adminLoginForm');
        const formData = new FormData(form);
        const credentials = Object.fromEntries(formData.entries());
        
        // Default admin credentials (in production, this should be more secure)
        const adminCredentials = {
            username: 'admin',
            password: 'admin123'
        };

        if (credentials.username === adminCredentials.username && 
            credentials.password === adminCredentials.password) {
            
            // Login successful
            this.isAdminLoggedIn = true;
            localStorage.setItem('adminLoggedIn', 'true');
            
            this.showLoginMessage('Login successful! Redirecting to settings...', 'success');
            
            setTimeout(() => {
                this.closeModal(document.getElementById('adminLoginModal'));
                this.showSettingsContent();
                this.loadSettings();
                this.bindSettingsEvents();
            }, 1500);
            
        } else {
            this.showLoginMessage('Invalid username or password. Please try again.', 'error');
        }
    }

    showLoginMessage(message, type) {
        const messageDiv = document.getElementById('login-message');
        messageDiv.innerHTML = `<div class="login-${type}">${message}</div>`;
    }

    logoutAdmin() {
        this.isAdminLoggedIn = false;
        localStorage.removeItem('adminLoggedIn');
        this.showAccessDenied();
        this.showNotification('Admin logged out successfully', 'success');
    }

    checkSettingsAccess() {
        if (this.isAdminLoggedIn) {
            window.location.href = 'settings.html';
        } else {
            this.showAdminLogin();
        }
    }

    // CRUD Operations
    editAppointment(appointmentId) {
        const appointment = this.appointments.find(apt => apt.id === appointmentId);
        if (appointment) {
            // Redirect to edit page or show modal
            window.location.href = `add-appointment.html?edit=${appointmentId}`;
        }
    }

    deleteAppointment(appointmentId) {
        if (confirm('Are you sure you want to delete this appointment?')) {
            this.appointments = this.appointments.filter(apt => apt.id !== appointmentId);
            this.saveToStorage('appointments', this.appointments);
            this.showNotification('Appointment deleted successfully!', 'success');
            
            // Refresh current page data
            this.initializePage();
        }
    }

    viewAppointment(appointmentId) {
        const appointment = this.appointments.find(apt => apt.id === appointmentId);
        if (appointment) {
            // Show appointment details modal
            this.showAppointmentDetailsModal(appointment);
        }
    }

    showAppointmentDetailsModal(appointment) {
        const provider = this.providers.find(p => p.id === appointment.provider);
        const modalHtml = `
            <div class="modal" id="appointmentDetailsModal" style="display: flex;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Appointment Details</h2>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div style="padding: 2rem;">
                        <div class="appointment-details-grid">
                            <div><strong>Client:</strong> ${appointment.clientName}</div>
                            <div>
  <strong>Email:</strong> 
  ${appointment.clientEmail && appointment.emailVerified ? appointment.clientEmail : '<span style="color: red;">Email not verified or missing</span>'}
</div>
                            <div><strong>Phone:</strong> ${appointment.clientPhone || 'N/A'}</div>
                            <div><strong>Date:</strong> ${this.formatDateDisplay(appointment.date)}</div>
                            <div><strong>Time:</strong> ${this.formatTime(appointment.time)}</div>
                            <div><strong>Duration:</strong> ${appointment.duration} minutes</div>
                            <div><strong>Provider:</strong> ${provider?.name || 'Unknown'}</div>
                            <div><strong>Type:</strong> ${this.formatAppointmentType(appointment.type)}</div>
                            <div><strong>Status:</strong> ${this.formatStatus(appointment.status)}</div>
                            <div><strong>Priority:</strong> ${appointment.priority}</div>
                            <div><strong>Location:</strong> ${appointment.location}</div>
                            <div><strong>Notes:</strong> ${appointment.notes || 'No notes'}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    // Utility Functions
    generateId(prefix = 'APT') {
        return prefix + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    formatDate(date) {
        if (typeof date === 'string') return date;
        return date.toISOString().split('T')[0];
    }

    formatDateDisplay(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    formatTime(timeStr) {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    }

    formatAppointmentType(type) {
        return type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ');
    }

    formatStatus(status) {
        return status.charAt(0).toUpperCase() + status.slice(1);
    }

    timeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    saveToStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            modal.remove();
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 1rem;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .notification-content { display: flex; align-items: center; gap: 0.5rem; }
            .notification-close { background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; }
        `;
        document.head.appendChild(style);

        // Add to page
        document.body.appendChild(notification);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    handleSearch(query) {
        if (!query.trim()) return;

        // Search across appointments and clients
        const results = [
            ...this.appointments.filter(apt => 
                apt.clientName.toLowerCase().includes(query.toLowerCase()) ||
                apt.clientEmail.toLowerCase().includes(query.toLowerCase()) ||
                apt.type.toLowerCase().includes(query.toLowerCase())
            ),
            ...this.clients.filter(client =>
                client.name.toLowerCase().includes(query.toLowerCase()) ||
                client.email.toLowerCase().includes(query.toLowerCase())
            )
        ];

        console.log('Search results:', results);
        // Implement search results display
    }
}

// Initialize the application
let appointmentManager;

document.addEventListener('DOMContentLoaded', () => {
    appointmentManager = new AppointmentManager();
});

// Export for global access
window.appointmentManager = appointmentManager;

// Additional Utility Functions and Enhancements
class AppointmentUtils {
    static formatPhoneNumber(phone) {
        // Format phone number to (XXX) XXX-XXXX
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phone;
    }

    static validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    static validateIndianPhone(phone) {
        // Indian phone number patterns:
        // +91-XX-XXXX-XXXX (mobile)
        // +91-XX-XXXX-XXXX (landline)
        // +91XXXXXXXXXX (without dashes)
        // 0XXXXXXXXXX (without country code)
        const phoneRegex = /^(\+91[-\s]?)?[6-9]\d{9}$|^(\+91[-\s]?)?[2-9]\d{7,8}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    static async verifyEmail(email) {
        // Simulate email verification process
        return new Promise((resolve) => {
            setTimeout(() => {
                // In a real application, this would send a verification email
                // For demo purposes, we'll simulate verification
                const isVerified = Math.random() > 0.3; // 70% success rate for demo
                resolve({
                    success: isVerified,
                    message: isVerified ? 'Email verified successfully' : 'Email verification failed'
                });
            }, 2000);
        });
    }

    static generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    static calculateAge(dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    static getTimeSlots(startTime, endTime, duration = 30, bufferTime = 10) {
        const slots = [];
        const start = new Date(`2000-01-01T${startTime}:00`);
        const end = new Date(`2000-01-01T${endTime}:00`);
        const slotDuration = (duration + bufferTime) * 60 * 1000; // Convert to milliseconds
        
        let current = new Date(start);
        while (current < end) {
            slots.push(current.toTimeString().slice(0, 5));
            current = new Date(current.getTime() + slotDuration);
        }
        return slots;
    }

    static generateRecurringAppointments(baseAppointment, pattern) {
        const appointments = [];
        const startDate = new Date(baseAppointment.date);
        
        for (let i = 0; i < pattern.occurrences; i++) {
            const appointmentDate = new Date(startDate);
            
            switch (pattern.frequency) {
                case 'daily':
                    appointmentDate.setDate(startDate.getDate() + (i * pattern.interval));
                    break;
                case 'weekly':
                    appointmentDate.setDate(startDate.getDate() + (i * pattern.interval * 7));
                    break;
                case 'monthly':
                    appointmentDate.setMonth(startDate.getMonth() + (i * pattern.interval));
                    break;
            }
            
            if (i === 0) continue; // Skip the original appointment
            
            const newAppointment = {
                ...baseAppointment,
                id: 'APT' + Date.now().toString(36) + Math.random().toString(36).substr(2),
                date: appointmentDate.toISOString().split('T')[0],
                isRecurring: true,
                recurringId: baseAppointment.id
            };
            
            appointments.push(newAppointment);
        }
        
        return appointments;
    }
}

// Enhanced Form Validation
class FormValidator {
    constructor(form) {
        this.form = form;
        this.errors = {};
    }

    validate() {
        this.errors = {};
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            this.validateField(input);
        });
        
        this.displayErrors();
        return Object.keys(this.errors).length === 0;
    }

    validateField(field) {
        const value = field.value.trim();
        const name = field.name;
        const type = field.type;
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            this.addError(name, `${this.getFieldLabel(field)} is required`);
            return;
        }
        
        // Type-specific validation
        switch (type) {
            case 'email':
                if (value && !AppointmentUtils.validateEmail(value)) {
                    this.addError(name, 'Please enter a valid email address');
                }
                break;
            case 'tel':
                if (value && !/^[\d\s\-\(\)\+]+$/.test(value)) {
                    this.addError(name, 'Please enter a valid phone number');
                }
                break;
            case 'date':
                if (value && new Date(value) < new Date().setHours(0, 0, 0, 0)) {
                    this.addError(name, 'Date cannot be in the past');
                }
                break;
            case 'time':
                if (value && field.name === 'appointmentTime') {
                    const dateField = this.form.querySelector('[name="appointmentDate"]');
                    if (dateField && dateField.value === new Date().toISOString().split('T')[0]) {
                        const now = new Date();
                        const selectedTime = new Date(`${dateField.value}T${value}`);
                        if (selectedTime < now) {
                            this.addError(name, 'Time cannot be in the past');
                        }
                    }
                }
                break;
        }
        
        // Custom validation rules
        this.customValidation(field, value);
    }

    customValidation(field, value) {
        const name = field.name;
        
        switch (name) {
            case 'clientName':
                if (value && value.length < 2) {
                    this.addError(name, 'Name must be at least 2 characters long');
                }
                break;
            case 'duration':
                if (value && (parseInt(value) < 15 || parseInt(value) > 240)) {
                    this.addError(name, 'Duration must be between 15 and 240 minutes');
                }
                break;
        }
    }

    addError(field, message) {
        if (!this.errors[field]) {
            this.errors[field] = [];
        }
        this.errors[field].push(message);
    }

    displayErrors() {
        // Clear previous errors
        this.form.querySelectorAll('.error-message').forEach(el => el.remove());
        this.form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        
        // Display new errors
        Object.keys(this.errors).forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                field.classList.add('error');
                
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = this.errors[fieldName][0];
                
                const parent = field.closest('.form-group');
                if (parent) {
                    parent.appendChild(errorDiv);
                }
            }
        });
    }

    getFieldLabel(field) {
        const label = this.form.querySelector(`label[for="${field.id}"]`);
        return label ? label.textContent.replace('*', '').trim() : field.name;
    }
}

// Real-time Clock and Updates
class ClockManager {
    constructor() {
        this.init();
    }

    init() {
        this.updateClock();
        this.startClockInterval();
        this.updateRelativeTimes();
        this.startRelativeTimeInterval();
    }

    updateClock() {
        const clockElements = document.querySelectorAll('.current-time');
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        clockElements.forEach(el => {
            el.textContent = timeString;
        });
    }

    startClockInterval() {
        setInterval(() => {
            this.updateClock();
        }, 1000);
    }

    updateRelativeTimes() {
        const relativeElements = document.querySelectorAll('[data-relative-time]');
        relativeElements.forEach(el => {
            const timestamp = el.getAttribute('data-relative-time');
            const relativeTime = this.getRelativeTime(new Date(timestamp));
            el.textContent = relativeTime;
        });
    }

    startRelativeTimeInterval() {
        setInterval(() => {
            this.updateRelativeTimes();
        }, 60000); // Update every minute
    }

    getRelativeTime(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMinutes = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        
        return date.toLocaleDateString();
    }
}

// Auto-save functionality
class AutoSave {
    constructor(formSelector, saveCallback, interval = 30000) {
        this.form = document.querySelector(formSelector);
        this.saveCallback = saveCallback;
        this.interval = interval;
        this.lastSave = null;
        this.isDirty = false;
        
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.bindEvents();
        this.startAutoSave();
        this.loadDraft();
    }

    bindEvents() {
        this.form.addEventListener('input', () => {
            this.isDirty = true;
            this.showDraftIndicator();
        });

        window.addEventListener('beforeunload', (e) => {
            if (this.isDirty) {
                this.saveDraft();
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    startAutoSave() {
        setInterval(() => {
            if (this.isDirty) {
                this.saveDraft();
            }
        }, this.interval);
    }

    saveDraft() {
        const formData = new FormData(this.form);
        const draftData = Object.fromEntries(formData.entries());
        
        localStorage.setItem('appointmentDraft', JSON.stringify({
            data: draftData,
            timestamp: new Date().toISOString()
        }));
        
        this.isDirty = false;
        this.lastSave = new Date();
        this.showSavedIndicator();
    }

    loadDraft() {
        const draft = localStorage.getItem('appointmentDraft');
        if (draft) {
            const draftData = JSON.parse(draft);
            const draftAge = new Date() - new Date(draftData.timestamp);
            
            // Only load draft if it's less than 24 hours old
            if (draftAge < 24 * 60 * 60 * 1000) {
                if (confirm('A draft was found. Would you like to restore it?')) {
                    Object.keys(draftData.data).forEach(key => {
                        const field = this.form.querySelector(`[name="${key}"]`);
                        if (field) {
                            field.value = draftData.data[key];
                        }
                    });
                    this.showDraftIndicator();
                }
            } else {
                localStorage.removeItem('appointmentDraft');
            }
        }
    }

    clearDraft() {
        localStorage.removeItem('appointmentDraft');
        this.isDirty = false;
        this.hideDraftIndicator();
    }

    showDraftIndicator() {
        let indicator = document.querySelector('.draft-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'draft-indicator';
            indicator.innerHTML = '<i class="fas fa-edit"></i> Draft saved automatically';
            document.body.appendChild(indicator);
        }
        indicator.style.display = 'block';
    }

    showSavedIndicator() {
        let indicator = document.querySelector('.draft-indicator');
        if (indicator) {
            indicator.innerHTML = '<i class="fas fa-check"></i> Draft saved';
            setTimeout(() => {
                indicator.style.display = 'none';
            }, 2000);
        }
    }

    hideDraftIndicator() {
        const indicator = document.querySelector('.draft-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }
}

// Keyboard Shortcuts
class KeyboardShortcuts {
    constructor() {
        this.shortcuts = {
            'ctrl+n': () => window.location.href = 'add-appointment.html',
            'ctrl+shift+a': () => window.location.href = 'appointments.html',
            'ctrl+shift+c': () => window.location.href = 'calendar.html',
            'ctrl+shift+p': () => window.location.href = 'clients.html',
            'ctrl+shift+s': () => window.location.href = 'settings.html',
            'ctrl+h': () => window.location.href = 'index.html',
            'ctrl+s': (e) => {
                e.preventDefault();
                this.saveCurrentForm();
            },
            'escape': () => {
                this.closeModals();
            }
        };
        
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            const key = this.getKeyCombo(e);
            if (this.shortcuts[key]) {
                this.shortcuts[key](e);
            }
        });
    }

    getKeyCombo(e) {
        const parts = [];
        if (e.ctrlKey) parts.push('ctrl');
        if (e.shiftKey) parts.push('shift');
        if (e.altKey) parts.push('alt');
        parts.push(e.key.toLowerCase());
        return parts.join('+');
    }

    saveCurrentForm() {
        const form = document.querySelector('form:not([hidden])');
        if (form) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.click();
            }
        }
    }

    closeModals() {
        const modals = document.querySelectorAll('.modal[style*="flex"]');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }
}

// Enhanced Data Backup and Restore
class DataManager {
    static exportData(format = 'json') {
        const data = {
            appointments: JSON.parse(localStorage.getItem('appointments') || '[]'),
            clients: JSON.parse(localStorage.getItem('clients') || '[]'),
            providers: JSON.parse(localStorage.getItem('providers') || '[]'),
            settings: JSON.parse(localStorage.getItem('settings') || '{}'),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        switch (format) {
            case 'json':
                this.downloadJSON(data, 'appointment-backup.json');
                break;
            case 'csv':
                this.downloadCSV(data.appointments, 'appointments.csv');
                break;
            default:
                console.error('Unsupported format:', format);
        }
    }

    static downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        this.downloadBlob(blob, filename);
    }

    static downloadCSV(appointments, filename) {
        const headers = ['ID', 'Client Name', 'Date', 'Time', 'Duration', 'Type', 'Provider', 'Status'];
        const rows = appointments.map(apt => [
            apt.id,
            apt.clientName,
            apt.date,
            apt.time,
            apt.duration,
            apt.type,
            apt.provider,
            apt.status
        ]);

        const csvContent = [headers, ...rows].map(row => 
            row.map(field => `"${field}"`).join(',')
        ).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        this.downloadBlob(blob, filename);
    }

    static downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    static importData(file, callback) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (this.validateImportData(data)) {
                    this.restoreData(data);
                    callback({ success: true, message: 'Data imported successfully!' });
                } else {
                    callback({ success: false, message: 'Invalid file format' });
                }
            } catch (error) {
                callback({ success: false, message: 'Error reading file: ' + error.message });
            }
        };
        reader.readAsText(file);
    }

    static validateImportData(data) {
        return data.appointments && Array.isArray(data.appointments) &&
               data.clients && Array.isArray(data.clients) &&
               data.version;
    }

    static restoreData(data) {
        localStorage.setItem('appointments', JSON.stringify(data.appointments));
        localStorage.setItem('clients', JSON.stringify(data.clients));
        
        if (data.providers) {
            localStorage.setItem('providers', JSON.stringify(data.providers));
        }
        
        if (data.settings) {
            localStorage.setItem('settings', JSON.stringify(data.settings));
        }
    }

    static clearAllData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            localStorage.removeItem('appointments');
            localStorage.removeItem('clients');
            localStorage.removeItem('providers');
            localStorage.removeItem('settings');
            localStorage.removeItem('appointmentDraft');
            
            window.location.reload();
        }
    }
}

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', () => {
    // Initialize clock manager
    new ClockManager();
    
    // Initialize keyboard shortcuts
    new KeyboardShortcuts();
    
    // Initialize auto-save for appointment form
    if (document.querySelector('.appointment-form')) {
        new AutoSave('.appointment-form', (data) => {
            console.log('Auto-saving appointment draft...');
        });
    }
    
    // Add helpful tooltips
    const tooltips = document.querySelectorAll('[title]');
    tooltips.forEach(el => {
        el.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = e.target.getAttribute('title');
            document.body.appendChild(tooltip);
            
            const rect = e.target.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
            
            e.target.removeAttribute('title');
            e.target.setAttribute('data-original-title', tooltip.textContent);
        });
        
        el.addEventListener('mouseleave', (e) => {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
            
            const originalTitle = e.target.getAttribute('data-original-title');
            if (originalTitle) {
                e.target.setAttribute('title', originalTitle);
                e.target.removeAttribute('data-original-title');
            }
        });
    });
});

// Add data export functions to window
window.DataManager = DataManager;
window.AppointmentUtils = AppointmentUtils;
