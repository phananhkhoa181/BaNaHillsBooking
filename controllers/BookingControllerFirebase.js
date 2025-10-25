// ===================================
// Booking Controller - Firebase Version
// ===================================

import firebaseQueueService from '../services/FirebaseQueueService.js';

class BookingControllerFirebase {
    constructor() {
        this.bookingModel = new Booking();
        this.currentRoute = null;
        this.firebaseService = firebaseQueueService;
        this.init();
    }

    // Initialize controller
    async init() {
        this.setupEventListeners();
        this.setupFormValidation();
        this.setMinDate();
        
        // Initialize Firebase
        await this.initializeFirebase();
    }

    // Initialize Firebase and start auto-reset
    async initializeFirebase() {
        try {
            // Initialize today's queue
            await this.firebaseService.initializeDailyQueue();
            
            // Start auto-reset scheduler (22:00 daily)
            this.firebaseService.startAutoResetScheduler();
            
            console.log('✅ Firebase initialized successfully');
        } catch (error) {
            console.error('❌ Firebase initialization failed:', error);
            alert('Lỗi kết nối Firebase. Vui lòng thử lại sau.');
        }
    }

    // Setup event listeners
    setupEventListeners() {
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

    // ===================================
    // FIREBASE QUEUE METHODS
    // ===================================

    // Open queue modal with Firebase data
    async openBookingModal(route) {
        this.currentRoute = route;
        
        // Check session storage first
        const sessionKey = `user_queue_${route}`;
        const existingQueueData = sessionStorage.getItem(sessionKey);
        
        let queueNumber, currentServing, waitTime;
        
        try {
            if (existingQueueData) {
                // User already has a number - restore it
                const queueData = JSON.parse(existingQueueData);
                queueNumber = queueData.queueNumber;
                console.log('📋 Restored existing queue number:', queueNumber);
            } else {
                // Generate new queue number from Firebase
                queueNumber = await this.firebaseService.generateQueueNumber(route);
                
                // Save to sessionStorage
                const queueData = {
                    queueNumber: queueNumber,
                    route: route,
                    timestamp: new Date().toISOString()
                };
                sessionStorage.setItem(sessionKey, JSON.stringify(queueData));
                
                console.log('🎫 Generated new queue number:', queueNumber);
            }

            // Get current serving number from Firebase
            currentServing = await this.firebaseService.getServingNumber(route);
            waitTime = this.calculateWaitTime(queueNumber, currentServing);

            const routeName = route === 'forward' 
                ? 'Ga Suối Mơ → Đỉnh Bà Nà' 
                : 'Đỉnh Bà Nà → Ga Suối Mơ';
            
            // Update modal content
            document.getElementById('yourQueueNumber').textContent = queueNumber;
            document.getElementById('currentServingNumber').textContent = currentServing;
            document.getElementById('queueRouteName').textContent = routeName;
            document.getElementById('estimatedWait').textContent = waitTime;
            
            // Show modal
            const modal = document.getElementById('queueModal');
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Trigger animation
            setTimeout(() => {
                const modalContent = modal.querySelector('.queue-modal-content');
                modalContent.classList.add('show-animation');
            }, 50);

            // Listen to real-time updates
            this.startRealtimeListener(route);

        } catch (error) {
            console.error('❌ Error opening booking modal:', error);
            alert('Có lỗi xảy ra. Vui lòng thử lại!');
        }
    }

    // Start listening to real-time queue updates
    startRealtimeListener(route) {
        // Clean up existing listeners
        if (this.queueListener) {
            this.queueListener();
        }

        // Listen to updates
        this.queueListener = this.firebaseService.listenToQueue(route, (data) => {
            const servingElement = document.getElementById('currentServingNumber');
            if (servingElement && data.servingNumber) {
                servingElement.textContent = data.servingNumber;
                
                // Update wait time
                const yourNumber = document.getElementById('yourQueueNumber').textContent;
                const newWaitTime = this.calculateWaitTime(yourNumber, data.servingNumber);
                document.getElementById('estimatedWait').textContent = newWaitTime;
            }
        });
    }

    // Calculate estimated wait time
    calculateWaitTime(queueNumber, servingNumber) {
        const queueNum = parseInt(queueNumber.substring(1));
        const servingNum = parseInt(servingNumber.substring(1));
        const difference = queueNum - servingNum;
        
        if (difference <= 0) return 'Đến lượt bạn!';
        if (difference <= 1) return '1-2 phút';
        if (difference <= 3) return '3-5 phút';
        if (difference <= 5) return '5-10 phút';
        if (difference <= 10) return '10-15 phút';
        return '15-20 phút';
    }

    // Close queue modal
    closeQueueModal() {
        const modal = document.getElementById('queueModal');
        const modalContent = modal.querySelector('.queue-modal-content');
        modalContent.classList.remove('show-animation');
        
        // Stop listening to updates
        if (this.queueListener) {
            this.queueListener();
            this.queueListener = null;
        }
        
        setTimeout(() => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }, 300);
    }

    // Close all modals
    closeAllModals() {
        this.closeQueueModal();
    }

    // Check if user has existing queue numbers
    hasExistingQueueNumbers() {
        const forward = sessionStorage.getItem('user_queue_forward');
        const return_route = sessionStorage.getItem('user_queue_return');
        return {
            forward: forward ? JSON.parse(forward) : null,
            return: return_route ? JSON.parse(return_route) : null
        };
    }

    // Check and auto-show existing queue on page load
    checkAndShowExistingQueue() {
        const existing = this.hasExistingQueueNumbers();
        
        if (existing.forward) {
            setTimeout(() => {
                this.openBookingModal('forward');
            }, 300);
        } else if (existing.return) {
            setTimeout(() => {
                this.openBookingModal('return');
            }, 300);
        }
    }

    // Clear user's queue number
    clearUserQueueNumber(route) {
        const sessionKey = `user_queue_${route}`;
        sessionStorage.removeItem(sessionKey);
        console.log(`Cleared queue number for route: ${route}`);
    }

    // Cleanup on page unload
    cleanup() {
        if (this.queueListener) {
            this.queueListener();
        }
        this.firebaseService.cleanup();
    }
}

// Initialize controller when DOM is ready
let bookingController;
document.addEventListener('DOMContentLoaded', () => {
    bookingController = new BookingControllerFirebase();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        bookingController.cleanup();
    });
});

export { bookingController };
