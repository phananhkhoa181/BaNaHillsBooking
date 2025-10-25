// Booking Controller - Firebase version
import FirebaseService from '../services/FirebaseService.js';

class BookingController {
    constructor() {
        this.currentRoute = null;
        this.listeners = [];
        this.modalListener = null; // Listener for modal updates
        this.init();
    }

    /**
     * Calculate wait time based on queue position
     * - Distance 1-6: 3 minutes
     * - Distance 7-12: 15 minutes  
     * - Distance 13-18: 30 minutes
     * - Every 6 numbers: +15 minutes
     * Example:
     * - Current serving: 5, Your number: 7 → Distance: 2 → 3 minutes
     * - Current serving: 5, Your number: 12 → Distance: 7 → 15 minutes
     * - Current serving: 5, Your number: 18 → Distance: 13 → 30 minutes
     * - Current serving: 5, Your number: 24 → Distance: 19 → 45 minutes
     */
    calculateWaitTime(queueNumber, currentServing) {
        const distance = Math.max(0, queueNumber - currentServing);
        
        if (distance === 0) {
            return 0; // Already being served or next
        }
        
        if (distance <= 6) {
            return 3; // First 6 numbers away: 3 minutes
        }
        
        // Calculate which "batch" of 6 this distance falls into (starting from batch 1)
        // Distance 7-12 = batch 1, 13-18 = batch 2, etc.
        const batch = Math.floor((distance - 1) / 6);
        
        // Base time: 15 minutes per batch
        const waitTime = batch * 15;
        
        return waitTime;
    }

    init() {
        this.setupEventListeners();
        FirebaseService.startAutoResetScheduler();
        this.setupCurrentNumberListeners();
        
        // Check if user has existing queue number in this session
        this.checkAndRestoreQueueNumber();
    }

    checkAndRestoreQueueNumber() {
        // Check sessionStorage for existing queue numbers
        const sessionData = sessionStorage.getItem('userQueueData');
        
        if (sessionData) {
            try {
                const queueData = JSON.parse(sessionData);
                console.log('Found existing queue data:', queueData);
                
                // Show the existing queue number
                this.showQueueModal(
                    queueData.queueNumber,
                    queueData.currentServing || 0,
                    queueData.waitTime || 0,
                    queueData.routeName
                );
            } catch (error) {
                console.error('Error restoring queue data:', error);
            }
        }
    }

    setupCurrentNumberListeners() {
        FirebaseService.listenToCurrentNumber('suoimoBaNa', (number) => {
            const el = document.getElementById('current-suoimoBaNa');
            if (el) el.textContent = number;
        });
        FirebaseService.listenToCurrentNumber('baNaSuoimo', (number) => {
            const el = document.getElementById('current-baNaSuoimo');
            if (el) el.textContent = number;
        });
    }

    setupEventListeners() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
        }

        // Modal close buttons
        const closeModalBtns = document.querySelectorAll('.close-modal');
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => this.closeQueueModal());
        });

        // Close modal on outside click
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('queueModal');
            if (e.target === modal) {
                this.closeQueueModal();
            }
        });
    }

    async openBookingModal(route) {
        try {
            console.log('Opening booking modal for route:', route);
            
            const routeMap = { 
                forward: 'suoimoBaNa', 
                return: 'baNaSuoimo' 
            };
            const actualRoute = routeMap[route] || route;
            
            console.log('Mapped route:', actualRoute);
            
            // Get queue number from Firebase
            const queueNumber = await FirebaseService.getNextQueueNumber(actualRoute);
            console.log('Queue number:', queueNumber);
            
            // Use cached current number to save reads
            const currentServing = FirebaseService.getCachedCurrentNumber(actualRoute);
            console.log('Current serving (cached):', currentServing);
            
            // Calculate wait time using new logic
            const waitTime = this.calculateWaitTime(queueNumber, currentServing);
            console.log('Calculated wait time:', waitTime, 'minutes');
            
            // Get route name
            const routeName = route === 'forward' 
                ? 'Ga Suối Mơ → Đỉnh Bà Nà' 
                : 'Đỉnh Bà Nà → Ga Suối Mơ';
            
            // Save to sessionStorage (persists until tab/browser closed)
            const queueData = {
                queueNumber: queueNumber,
                currentServing: currentServing,
                waitTime: waitTime,
                routeName: routeName,
                route: actualRoute,
                timestamp: Date.now()
            };
            sessionStorage.setItem('userQueueData', JSON.stringify(queueData));
            console.log('Saved queue data to sessionStorage');
            
            // Save booking to Firebase history
            await FirebaseService.saveBookingHistory(actualRoute, queueNumber);
            
            // Show modal
            this.showQueueModal(queueNumber, currentServing, waitTime, routeName);
            
        } catch (error) {
            console.error('Error getting queue number:', error);
            alert('Có lỗi xảy ra khi lấy số thứ tự: ' + error.message);
        }
    }

    showQueueModal(queueNumber, currentServing, waitTime, routeName) {
        // Update modal content
        const modal = document.getElementById('queueModal');
        const modalContent = modal?.querySelector('.queue-modal-content');
        const yourNumber = document.getElementById('yourQueueNumber');
        const servingNumber = document.getElementById('currentServingNumber');
        const routeNameEl = document.getElementById('queueRouteName');
        const waitTimeEl = document.getElementById('estimatedWait');
        const queueDateEl = document.getElementById('queueDate');
        
        // Format current date
        const now = new Date();
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const timeOptions = {
            hour: '2-digit',
            minute: '2-digit'
        };
        const dateStr = now.toLocaleDateString('vi-VN', dateOptions);
        const timeStr = now.toLocaleTimeString('vi-VN', timeOptions);
        const fullDateTime = `${dateStr}, ${timeStr}`;
        
        if (yourNumber) yourNumber.textContent = String(queueNumber).padStart(3, '0');
        if (servingNumber) servingNumber.textContent = String(currentServing).padStart(3, '0');
        if (routeNameEl) routeNameEl.textContent = routeName;
        if (waitTimeEl) waitTimeEl.textContent = waitTime > 0 ? `${waitTime} phút` : 'Sẵn sàng';
        if (queueDateEl) queueDateEl.textContent = fullDateTime;
        
        // Get route from sessionStorage to set up listener
        const sessionData = sessionStorage.getItem('userQueueData');
        let actualRoute = null;
        
        if (sessionData) {
            try {
                const queueData = JSON.parse(sessionData);
                actualRoute = queueData.route;
            } catch (error) {
                console.error('Error parsing session data:', error);
            }
        }
        
        // Set up real-time listener for current serving number
        if (actualRoute && !this.modalListener) {
            console.log('Setting up modal listener for route:', actualRoute);
            this.modalListener = FirebaseService.listenToCurrentNumber(actualRoute, (newServingNumber) => {
                console.log('Current serving updated to:', newServingNumber);
                
                // Update the serving number in modal
                const servingNumberEl = document.getElementById('currentServingNumber');
                if (servingNumberEl) {
                    servingNumberEl.textContent = String(newServingNumber).padStart(3, '0');
                }
                
                // Recalculate wait time
                const waitTimeElement = document.getElementById('estimatedWait');
                if (waitTimeElement) {
                    const newWaitTime = this.calculateWaitTime(queueNumber, newServingNumber);
                    waitTimeElement.textContent = newWaitTime > 0 ? `${newWaitTime} phút` : 'Sẵn sàng';
                }
                
                // Update sessionStorage with new current serving
                if (sessionData) {
                    try {
                        const queueData = JSON.parse(sessionData);
                        queueData.currentServing = newServingNumber;
                        queueData.waitTime = this.calculateWaitTime(queueNumber, newServingNumber);
                        sessionStorage.setItem('userQueueData', JSON.stringify(queueData));
                    } catch (error) {
                        console.error('Error updating session data:', error);
                    }
                }
            });
        }
        
        // Show modal with flexbox centering
        if (modal) {
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.classList.add('active');
            
            // Trigger animation
            if (modalContent) {
                setTimeout(() => {
                    modalContent.classList.add('show-animation');
                }, 50);
            }
            
            console.log('Modal displayed');
        }
    }

    closeQueueModal() {
        const modal = document.getElementById('queueModal');
        const modalContent = modal?.querySelector('.queue-modal-content');
        
        // Unsubscribe from modal listener to prevent memory leaks
        if (this.modalListener) {
            console.log('Unsubscribing modal listener');
            this.modalListener();
            this.modalListener = null;
        }
        
        if (modal) {
            // Remove animation class first
            if (modalContent) {
                modalContent.classList.remove('show-animation');
            }
            
            // Then hide modal after animation
            setTimeout(() => {
                modal.style.display = 'none';
                modal.classList.remove('active');
            }, 300);
            
            // Clear sessionStorage when user manually closes modal
            sessionStorage.removeItem('userQueueData');
            
            console.log('Modal closed and session data cleared');
        }
    }

    destroy() {
        this.listeners.forEach(unsubscribe => unsubscribe());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.bookingController = new BookingController();
});
