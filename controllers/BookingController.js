// ===================================
// Booking Controller - Handles booking logic and UI interactions
// ===================================

class BookingController {
    constructor() {
        this.bookingModel = new Booking();
        this.currentRoute = null;
        this.init();
    }

    // Initialize controller
    init() {
        this.setupEventListeners();
        this.setupFormValidation();
        this.setMinDate();
    }

    // Setup event listeners
    setupEventListeners() {
        // Booking form submission
        const bookingForm = document.getElementById('bookingForm');
        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => this.handleBookingSubmit(e));
        }

        // Contact form submission
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
        }

        // Modal close button
        const closeButtons = document.querySelectorAll('.close-modal');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });

        // Close modal on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeAllModals();
            }
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    // Setup form validation
    setupFormValidation() {
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                // Only allow numbers and basic phone characters
                e.target.value = e.target.value.replace(/[^\d\s\-\+\(\)]/g, '');
            });
        });
    }

    // Set minimum date to today
    setMinDate() {
        const dateInput = document.getElementById('visitDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }
    }

    // Open booking modal
    openBookingModal(route) {
        this.currentRoute = route;
        const modal = document.getElementById('bookingModal');
        const modalTitle = document.getElementById('modalTitle');
        const routeInput = document.getElementById('routeType');

        if (route === 'forward') {
            modalTitle.textContent = 'Đặt Vé Cáp Treo - Chiều Đi';
        } else {
            modalTitle.textContent = 'Đặt Vé Cáp Treo - Chiều Về';
        }

        routeInput.value = route;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus first input
        setTimeout(() => {
            document.getElementById('customerName').focus();
        }, 100);
    }

    // Close booking modal
    closeBookingModal() {
        const modal = document.getElementById('bookingModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        this.resetBookingForm();
    }

    // Close success modal
    closeSuccessModal() {
        const modal = document.getElementById('successModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Close all modals
    closeAllModals() {
        this.closeBookingModal();
        this.closeSuccessModal();
    }

    // Reset booking form
    resetBookingForm() {
        const form = document.getElementById('bookingForm');
        if (form) {
            form.reset();
        }
        this.currentRoute = null;
    }

    // Handle booking form submission
    handleBookingSubmit(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            route: document.getElementById('routeType').value,
            customerName: document.getElementById('customerName').value.trim(),
            customerPhone: document.getElementById('customerPhone').value.trim(),
            customerEmail: document.getElementById('customerEmail').value.trim(),
            numberOfTickets: parseInt(document.getElementById('numberOfTickets').value),
            visitDate: document.getElementById('visitDate').value,
            notes: document.getElementById('notes').value.trim()
        };

        // Validate form data
        if (!this.validateBookingData(formData)) {
            return;
        }

        // Create ticket
        const ticket = this.bookingModel.createTicket(formData);

        if (ticket) {
            this.showSuccessModal(ticket);
            this.closeBookingModal();
        } else {
            this.showError('Có lỗi xảy ra khi đặt vé. Vui lòng thử lại.');
        }
    }

    // Validate booking data
    validateBookingData(data) {
        if (!data.customerName) {
            this.showError('Vui lòng nhập họ và tên');
            return false;
        }

        if (!data.customerPhone) {
            this.showError('Vui lòng nhập số điện thoại');
            return false;
        }

        if (data.customerPhone.length < 10) {
            this.showError('Số điện thoại không hợp lệ');
            return false;
        }

        if (!data.visitDate) {
            this.showError('Vui lòng chọn ngày đến');
            return false;
        }

        // Check if date is not in the past
        const selectedDate = new Date(data.visitDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            this.showError('Vui lòng chọn ngày trong tương lai');
            return false;
        }

        return true;
    }

    // Show success modal
    showSuccessModal(ticket) {
        const modal = document.getElementById('successModal');
        const queueNumber = document.getElementById('queueNumber');
        const confirmName = document.getElementById('confirmName');
        const confirmRoute = document.getElementById('confirmRoute');
        const confirmTickets = document.getElementById('confirmTickets');
        const confirmDate = document.getElementById('confirmDate');

        // Populate success modal
        queueNumber.textContent = ticket.queueNumber;
        confirmName.textContent = ticket.customerName;
        confirmRoute.textContent = ticket.getRouteDisplay();
        confirmTickets.textContent = `${ticket.numberOfTickets} vé`;
        confirmDate.textContent = this.formatDate(ticket.visitDate);

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Optional: Send confirmation email (would require backend)
        // this.sendConfirmationEmail(ticket);
    }

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Handle contact form submission
    handleContactSubmit(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !phone || !message) {
            this.showError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        // Simulate sending message (would require backend)
        this.showSuccess('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.');
        document.getElementById('contactForm').reset();
    }

    // Show error message
    showError(message) {
        // Create or update error notification
        this.showNotification(message, 'error');
    }

    // Show success message
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Style notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '24px',
            padding: '16px 24px',
            background: type === 'error' ? '#f44336' : type === 'success' ? '#4caf50' : '#2196f3',
            color: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            zIndex: '3000',
            animation: 'slideInRight 0.3s ease',
            fontWeight: '500',
            maxWidth: '400px'
        });

        // Add to document
        document.body.appendChild(notification);

        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // Get booking statistics (for admin/analytics)
    getStatistics() {
        return this.bookingModel.getStatistics();
    }
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize booking controller when DOM is ready
let bookingController;
document.addEventListener('DOMContentLoaded', () => {
    bookingController = new BookingController();
});
