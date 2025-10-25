// ===================================
// Firebase Service
// Handles all Firebase operations for queue management
// ===================================

import { 
    db, 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc,
    deleteDoc,
    increment, 
    onSnapshot,
    collection,
    query,
    where,
    orderBy,
    limitQuery,
    getDocs
} from '../config/firebase-config.js';

class FirebaseService {
    constructor() {
        this.listeners = new Map();
        this.currentNumberCache = {
            suoimoBaNa: 0,
            baNaSuoimo: 0
        };
        this.initializeCurrentNumberCache();
    }

    /**
     * Initialize cache for current numbers to reduce reads
     */
    initializeCurrentNumberCache() {
        // Listen to current numbers and cache them
        this.listenToCurrentNumber('suoimoBaNa', (number) => {
            this.currentNumberCache.suoimoBaNa = number;
        });
        this.listenToCurrentNumber('baNaSuoimo', (number) => {
            this.currentNumberCache.baNaSuoimo = number;
        });
    }

    /**
     * Get cached current number (no read operation)
     * @param {string} route
     * @returns {number}
     */
    getCachedCurrentNumber(route) {
        return this.currentNumberCache[route] || 0;
    }

    // ===================================
    // COUNTER OPERATIONS (Số được cấp)
    // ===================================

    /**
     * Get next queue number for a route
     * @param {string} route - 'suoimoBaNa' or 'baNaSuoimo'
     * @returns {Promise<number>} The new queue number
     */
    async getNextQueueNumber(route) {
        try {
            const counterRef = doc(db, 'queues', `counter-${route}`);
            
            // Increment counter
            await updateDoc(counterRef, {
                number: increment(1)
            });

            // Get updated value
            const snapshot = await getDoc(counterRef);
            return snapshot.data().number;
        } catch (error) {
            console.error('Error getting next queue number:', error);
            throw error;
        }
    }

    /**
     * Get current counter value
     * @param {string} route - 'suoimoBaNa' or 'baNaSuoimo'
     * @returns {Promise<number>}
     */
    async getCounterValue(route) {
        try {
            const counterRef = doc(db, 'queues', `counter-${route}`);
            const snapshot = await getDoc(counterRef);
            return snapshot.exists() ? snapshot.data().number : 0;
        } catch (error) {
            console.error('Error getting counter value:', error);
            return 0;
        }
    }

    /**
     * Set counter value (for staff)
     * @param {string} route
     * @param {number} value
     */
    async setCounterValue(route, value) {
        try {
            const counterRef = doc(db, 'queues', `counter-${route}`);
            await updateDoc(counterRef, { number: value });
            return true;
        } catch (error) {
            console.error('Error setting counter value:', error);
            return false;
        }
    }

    // ===================================
    // CURRENT NUMBER OPERATIONS (Số đang gọi)
    // ===================================

    /**
     * Get current calling number
     * @param {string} route
     * @returns {Promise<number>}
     */
    async getCurrentNumber(route) {
        try {
            const currentRef = doc(db, 'queues', `current-${route}`);
            const snapshot = await getDoc(currentRef);
            return snapshot.exists() ? snapshot.data().number : 0;
        } catch (error) {
            console.error('Error getting current number:', error);
            return 0;
        }
    }

    /**
     * Set current calling number (for staff)
     * @param {string} route
     * @param {number} value
     */
    async setCurrentNumber(route, value) {
        try {
            const currentRef = doc(db, 'queues', `current-${route}`);
            await updateDoc(currentRef, { number: value });
            return true;
        } catch (error) {
            console.error('Error setting current number:', error);
            return false;
        }
    }

    /**
     * Increment current number by 1
     * @param {string} route
     */
    async incrementCurrentNumber(route) {
        try {
            const currentRef = doc(db, 'queues', `current-${route}`);
            await updateDoc(currentRef, {
                number: increment(1)
            });
            return true;
        } catch (error) {
            console.error('Error incrementing current number:', error);
            return false;
        }
    }

    /**
     * Decrement current number by 1
     * @param {string} route
     */
    async decrementCurrentNumber(route) {
        try {
            const currentRef = doc(db, 'queues', `current-${route}`);
            const snapshot = await getDoc(currentRef);
            const currentValue = snapshot.data().number;
            
            if (currentValue > 0) {
                await updateDoc(currentRef, {
                    number: increment(-1)
                });
            }
            return true;
        } catch (error) {
            console.error('Error decrementing current number:', error);
            return false;
        }
    }

    // ===================================
    // REAL-TIME LISTENERS
    // ===================================

    /**
     * Listen to current number changes
     * @param {string} route
     * @param {function} callback - Called with new number value
     */
    listenToCurrentNumber(route, callback) {
        const currentRef = doc(db, 'queues', `current-${route}`);
        const listenerId = `current-${route}`;

        const unsubscribe = onSnapshot(currentRef, (snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.data().number);
            }
        });

        this.listeners.set(listenerId, unsubscribe);
        return unsubscribe;
    }

    /**
     * Listen to counter changes
     * @param {string} route
     * @param {function} callback
     */
    listenToCounter(route, callback) {
        const counterRef = doc(db, 'queues', `counter-${route}`);
        const listenerId = `counter-${route}`;

        const unsubscribe = onSnapshot(counterRef, (snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.data().number);
            }
        });

        this.listeners.set(listenerId, unsubscribe);
        return unsubscribe;
    }

    /**
     * Remove listener
     * @param {string} listenerId
     */
    removeListener(listenerId) {
        if (this.listeners.has(listenerId)) {
            this.listeners.get(listenerId)();
            this.listeners.delete(listenerId);
        }
    }

    // ===================================
    // RESET OPERATIONS
    // ===================================

    /**
     * Reset both counter and current for a route
     * @param {string} route
     */
    async resetQueue(route) {
        try {
            const counterRef = doc(db, 'queues', `counter-${route}`);
            const currentRef = doc(db, 'queues', `current-${route}`);

            await Promise.all([
                updateDoc(counterRef, { number: 0 }),
                updateDoc(currentRef, { number: 0 })
            ]);

            return true;
        } catch (error) {
            console.error('Error resetting queue:', error);
            return false;
        }
    }

    /**
     * Reset all queues (both routes)
     */
    async resetAllQueues() {
        try {
            await Promise.all([
                this.resetQueue('suoimoBaNa'),
                this.resetQueue('baNaSuoimo')
            ]);
            return true;
        } catch (error) {
            console.error('Error resetting all queues:', error);
            return false;
        }
    }

    // ===================================
    // BOOKING HISTORY (Lưu lịch sử tất cả bookings)
    // ===================================

    /**
     * Save booking to history collection
     * @param {string} route
     * @param {number} queueNumber
     */
    async saveBookingHistory(route, queueNumber) {
        try {
            // Create a unique document ID (timestamp-based)
            const bookingId = `${route}_${queueNumber}_${Date.now()}`;
            const bookingRef = doc(db, 'bookings', bookingId);
            
            await setDoc(bookingRef, {
                route: route,
                queueNumber: queueNumber,
                timestamp: Date.now(),
                date: new Date().toISOString(),
                status: 'pending' // pending, served, missed
            });
            
            console.log('Booking saved to history:', bookingId);
            return true;
        } catch (error) {
            console.error('Error saving booking history:', error);
            // Don't throw error - booking history is optional
            return false;
        }
    }

    /**
     * Get booking history for a route
     * @param {string} route
     * @param {number} limit - Number of records to fetch
     */
    async getBookingHistory(route, limit = 50) {
        try {
            const bookingsRef = collection(db, 'bookings');
            const q = query(
                bookingsRef,
                where('route', '==', route),
                orderBy('timestamp', 'desc'),
                limitQuery(limit)
            );
            
            const snapshot = await getDocs(q);
            const bookings = [];
            
            snapshot.forEach(doc => {
                bookings.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return bookings;
        } catch (error) {
            console.error('Error getting booking history:', error);
            return [];
        }
    }

    /**
     * Update booking status
     * @param {string} bookingId
     * @param {string} status - 'pending', 'served', 'missed'
     */
    async updateBookingStatus(bookingId, status) {
        try {
            const bookingRef = doc(db, 'bookings', bookingId);
            await updateDoc(bookingRef, {
                status: status,
                updatedAt: Date.now()
            });
            return true;
        } catch (error) {
            console.error('Error updating booking status:', error);
            return false;
        }
    }

    // ===================================
    // AUTO RESET AT 22:00
    // ===================================

    /**
     * Check and auto-reset if after 22:00
     */
    async checkAndAutoReset() {
        const now = new Date();
        const hours = now.getHours();
        
        // Check if it's after 22:00 (10 PM)
        if (hours >= 22) {
            const lastResetKey = 'lastResetDate';
            const lastReset = localStorage.getItem(lastResetKey);
            const today = now.toDateString();

            // Only reset once per day
            if (lastReset !== today) {
                console.log('Auto-resetting queues at 22:00...');
                await this.resetAllQueues();
                localStorage.setItem(lastResetKey, today);
                console.log('Queue reset completed');
                
                // Also cleanup old bookings (older than 30 days)
                await this.cleanupOldBookings(30);
            }
        }
    }

    /**
     * Delete bookings older than specified days
     * @param {number} daysToKeep - Number of days to keep (default: 30)
     */
    async cleanupOldBookings(daysToKeep = 30) {
        try {
            const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
            console.log(`Cleaning up bookings older than ${daysToKeep} days...`);
            
            // Get old bookings
            const bookingsRef = collection(db, 'bookings');
            const q = query(
                bookingsRef,
                where('timestamp', '<', cutoffTime),
                limitQuery(100) // Delete in batches to avoid timeout
            );
            
            const snapshot = await getDocs(q);
            
            if (snapshot.empty) {
                console.log('No old bookings to delete');
                return;
            }
            
            // Delete old bookings
            const deletePromises = [];
            snapshot.forEach(doc => {
                deletePromises.push(deleteDoc(doc.ref));
            });
            
            await Promise.all(deletePromises);
            console.log(`Deleted ${snapshot.size} old bookings`);
            
        } catch (error) {
            console.error('Error cleaning up old bookings:', error);
        }
    }

    /**
     * Start auto-reset scheduler (check every minute)
     */
    startAutoResetScheduler() {
        // Check immediately
        this.checkAndAutoReset();

        // Check every minute
        setInterval(() => {
            this.checkAndAutoReset();
        }, 60000); // 1 minute
    }

    // ===================================
    // STAFF AUTHENTICATION
    // ===================================

    /**
     * Verify staff login
     * @param {string} username
     * @param {string} password
     * @returns {Promise<Object|null>} Staff data or null
     */
    async verifyStaffLogin(username, password) {
        try {
            console.log('Attempting to verify login for:', username);
            
            // Create reference to staff document
            const staffRef = doc(db, 'staff', username);
            console.log('Staff ref created');
            
            // Get the document
            const snapshot = await getDoc(staffRef);
            console.log('Snapshot received, exists:', snapshot.exists());

            if (snapshot.exists()) {
                const staffData = snapshot.data();
                console.log('Staff data:', staffData);
                
                // Simple password check (should use hash in production)
                if (staffData.password === password) {
                    console.log('Password matched!');
                    return {
                        username: staffData.username,
                        name: staffData.name,
                        role: staffData.role
                    };
                } else {
                    console.log('Password mismatch');
                }
            } else {
                console.log('Staff document not found');
            }
            return null;
        } catch (error) {
            console.error('Error verifying staff login:', error);
            console.error('Error details:', error.message, error.code);
            throw error; // Re-throw to see the actual error in login page
        }
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        const staffSession = localStorage.getItem('staffSession');
        if (!staffSession) return false;

        try {
            const session = JSON.parse(staffSession);
            // Check if session is still valid (24 hours)
            const now = Date.now();
            return (now - session.timestamp) < (24 * 60 * 60 * 1000);
        } catch {
            return false;
        }
    }

    /**
     * Save staff session
     */
    saveStaffSession(staffData) {
        const session = {
            ...staffData,
            timestamp: Date.now()
        };
        localStorage.setItem('staffSession', JSON.stringify(session));
    }

    /**
     * Clear staff session (logout)
     */
    clearStaffSession() {
        localStorage.removeItem('staffSession');
    }

    /**
     * Get staff session data
     */
    getStaffSession() {
        const staffSession = localStorage.getItem('staffSession');
        if (!staffSession) return null;

        try {
            return JSON.parse(staffSession);
        } catch {
            return null;
        }
    }
}

// Export singleton instance
export default new FirebaseService();
