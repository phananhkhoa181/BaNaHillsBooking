// ===================================
// Booking Model - Manages ticket bookings
// ===================================

class Booking {
    constructor() {
        this.tickets = this.loadTickets();
    }

    // Load tickets from localStorage
    loadTickets() {
        try {
            const stored = localStorage.getItem('banahills_tickets');
            if (stored) {
                const tickets = JSON.parse(stored);
                return tickets.map(t => Ticket.fromJSON(t));
            }
        } catch (error) {
            console.error('Error loading tickets:', error);
        }
        return [];
    }

    // Save tickets to localStorage
    saveTickets() {
        try {
            const json = this.tickets.map(t => t.toJSON());
            localStorage.setItem('banahills_tickets', JSON.stringify(json));
            return true;
        } catch (error) {
            console.error('Error saving tickets:', error);
            return false;
        }
    }

    // Create a new ticket
    createTicket(ticketData) {
        const id = this.generateTicketId();
        const ticket = new Ticket(
            id,
            ticketData.route,
            ticketData.customerName,
            ticketData.customerPhone,
            ticketData.customerEmail,
            ticketData.numberOfTickets,
            ticketData.visitDate,
            ticketData.notes
        );

        if (ticket.isValid()) {
            this.tickets.push(ticket);
            this.saveTickets();
            return ticket;
        }
        return null;
    }

    // Generate unique ticket ID
    generateTicketId() {
        return 'TICKET_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Get ticket by ID
    getTicketById(id) {
        return this.tickets.find(t => t.id === id);
    }

    // Get ticket by queue number
    getTicketByQueueNumber(queueNumber) {
        return this.tickets.find(t => t.queueNumber === queueNumber);
    }

    // Get all tickets
    getAllTickets() {
        return this.tickets;
    }

    // Get tickets by route
    getTicketsByRoute(route) {
        return this.tickets.filter(t => t.route === route);
    }

    // Get tickets by date
    getTicketsByDate(date) {
        return this.tickets.filter(t => t.visitDate === date);
    }

    // Update ticket status
    updateTicketStatus(id, status) {
        const ticket = this.getTicketById(id);
        if (ticket) {
            ticket.status = status;
            this.saveTickets();
            return true;
        }
        return false;
    }

    // Cancel ticket
    cancelTicket(id) {
        return this.updateTicketStatus(id, 'cancelled');
    }

    // Get statistics
    getStatistics() {
        const total = this.tickets.length;
        const forward = this.getTicketsByRoute('forward').length;
        const returnRoute = this.getTicketsByRoute('return').length;
        const pending = this.tickets.filter(t => t.status === 'pending').length;
        const confirmed = this.tickets.filter(t => t.status === 'confirmed').length;

        return {
            total,
            forward,
            return: returnRoute,
            pending,
            confirmed
        };
    }

    // Clear all tickets (admin function)
    clearAllTickets() {
        this.tickets = [];
        this.saveTickets();
    }
}
