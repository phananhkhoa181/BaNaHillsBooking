// ===================================
// Firebase Queue Service
// ===================================

import { db, collection, doc, getDoc, setDoc, updateDoc, onSnapshot, increment } from '../config/firebase-config.js';

class FirebaseQueueService {
    constructor() {
        this.queueRef = collection(db, 'queues');
        this.configRef = doc(db, 'config', 'settings');
        this.listeners = [];
    }

    // ===================================
    // Initialize Daily Queue
    // ===================================
    async initializeDailyQueue() {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        
        try {
            // Check if today's queue exists
            const forwardDoc = await getDoc(doc(this.queueRef, `forward_${today}`));
            const returnDoc = await getDoc(doc(this.queueRef, `return_${today}`));

            // Initialize forward queue if not exists
            if (!forwardDoc.exists()) {
                await setDoc(doc(this.queueRef, `forward_${today}`), {
                    route: 'forward',
                    date: today,
                    currentNumber: 0,
                    servingNumber: 0,
                    lastReset: new Date().toISOString(),
                    createdAt: new Date().toISOString()
                });
                console.log('✅ Initialized forward queue for', today);
            }

            // Initialize return queue if not exists
            if (!returnDoc.exists()) {
                await setDoc(doc(this.queueRef, `return_${today}`), {
                    route: 'return',
                    date: today,
                    currentNumber: 0,
                    servingNumber: 0,
                    lastReset: new Date().toISOString(),
                    createdAt: new Date().toISOString()
                });
                console.log('✅ Initialized return queue for', today);
            }

            return true;
        } catch (error) {
            console.error('❌ Error initializing queue:', error);
            return false;
        }
    }

    // ===================================
    // Generate Next Queue Number
    // ===================================
    async generateQueueNumber(route) {
        const today = new Date().toISOString().split('T')[0];
        const docId = `${route}_${today}`;
        const queueDocRef = doc(this.queueRef, docId);

        try {
            // Get current queue document
            const queueDoc = await getDoc(queueDocRef);

            if (!queueDoc.exists()) {
                // Initialize if doesn't exist
                await this.initializeDailyQueue();
            }

            // Increment current number
            await updateDoc(queueDocRef, {
                currentNumber: increment(1)
            });

            // Get updated number
            const updatedDoc = await getDoc(queueDocRef);
            const data = updatedDoc.data();
            const number = data.currentNumber;

            // Format: A001, B001, etc.
            const prefix = route === 'forward' ? 'A' : 'B';
            const queueNumber = prefix + String(number).padStart(3, '0');

            console.log('🎫 Generated queue number:', queueNumber);
            return queueNumber;

        } catch (error) {
            console.error('❌ Error generating queue number:', error);
            throw error;
        }
    }

    // ===================================
    // Get Current Queue Status
    // ===================================
    async getQueueStatus(route) {
        const today = new Date().toISOString().split('T')[0];
        const docId = `${route}_${today}`;
        const queueDocRef = doc(this.queueRef, docId);

        try {
            const queueDoc = await getDoc(queueDocRef);

            if (!queueDoc.exists()) {
                await this.initializeDailyQueue();
                return { currentNumber: 0, servingNumber: 0 };
            }

            const data = queueDoc.data();
            return {
                currentNumber: data.currentNumber || 0,
                servingNumber: data.servingNumber || 0,
                lastReset: data.lastReset
            };

        } catch (error) {
            console.error('❌ Error getting queue status:', error);
            return { currentNumber: 0, servingNumber: 0 };
        }
    }

    // ===================================
    // Get Serving Number (formatted)
    // ===================================
    async getServingNumber(route) {
        const status = await this.getQueueStatus(route);
        const prefix = route === 'forward' ? 'A' : 'B';
        
        // Serving is always a few numbers behind current
        const servingNum = Math.max(0, status.currentNumber - Math.floor(Math.random() * 3 + 2));
        
        return prefix + String(servingNum).padStart(3, '0');
    }

    // ===================================
    // Listen to Real-time Updates
    // ===================================
    listenToQueue(route, callback) {
        const today = new Date().toISOString().split('T')[0];
        const docId = `${route}_${today}`;
        const queueDocRef = doc(this.queueRef, docId);

        const unsubscribe = onSnapshot(queueDocRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                const prefix = route === 'forward' ? 'A' : 'B';
                
                callback({
                    currentNumber: prefix + String(data.currentNumber).padStart(3, '0'),
                    servingNumber: prefix + String(data.servingNumber || 0).padStart(3, '0'),
                    raw: data
                });
            }
        }, (error) => {
            console.error('❌ Error listening to queue:', error);
        });

        this.listeners.push(unsubscribe);
        return unsubscribe;
    }

    // ===================================
    // Update Serving Number (Admin)
    // ===================================
    async updateServingNumber(route, number) {
        const today = new Date().toISOString().split('T')[0];
        const docId = `${route}_${today}`;
        const queueDocRef = doc(this.queueRef, docId);

        try {
            await updateDoc(queueDocRef, {
                servingNumber: number,
                lastUpdated: new Date().toISOString()
            });
            console.log('✅ Updated serving number to:', number);
            return true;
        } catch (error) {
            console.error('❌ Error updating serving number:', error);
            return false;
        }
    }

    // ===================================
    // Reset Queue (Auto at 22:00)
    // ===================================
    async resetQueue() {
        const today = new Date().toISOString().split('T')[0];
        
        try {
            // Reset forward queue
            await setDoc(doc(this.queueRef, `forward_${today}`), {
                route: 'forward',
                date: today,
                currentNumber: 0,
                servingNumber: 0,
                lastReset: new Date().toISOString(),
                createdAt: new Date().toISOString()
            });

            // Reset return queue
            await setDoc(doc(this.queueRef, `return_${today}`), {
                route: 'return',
                date: today,
                currentNumber: 0,
                servingNumber: 0,
                lastReset: new Date().toISOString(),
                createdAt: new Date().toISOString()
            });

            console.log('🔄 Queue reset successfully at 22:00');
            return true;
        } catch (error) {
            console.error('❌ Error resetting queue:', error);
            return false;
        }
    }

    // ===================================
    // Check and Auto-reset at 22:00
    // ===================================
    startAutoResetScheduler() {
        // Check every minute
        setInterval(() => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();

            // Reset at 22:00 (10 PM)
            if (hours === 22 && minutes === 0) {
                console.log('⏰ Auto-reset triggered at 22:00');
                this.resetQueue();
                
                // Clear user sessions
                sessionStorage.clear();
                localStorage.setItem('last_reset', now.toISOString());
            }
        }, 60000); // Check every minute

        console.log('⏰ Auto-reset scheduler started (22:00 daily)');
    }

    // ===================================
    // Cleanup Listeners
    // ===================================
    cleanup() {
        this.listeners.forEach(unsubscribe => unsubscribe());
        this.listeners = [];
    }
}

// Export singleton instance
const firebaseQueueService = new FirebaseQueueService();
export default firebaseQueueService;
