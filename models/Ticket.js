// ===================================
// Ticket Model - Represents a cable car ticket
// ===================================

class Ticket {
    constructor(id, route, customerName, customerPhone, customerEmail, numberOfTickets, visitDate, notes) {
        this.id = id;
        this.route = route; // 'forward' or 'return'
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.customerEmail = customerEmail;
        this.numberOfTickets = numberOfTickets;
        this.visitDate = visitDate;
        this.notes = notes;
        this.queueNumber = this.generateQueueNumber();
        this.createdAt = new Date();
        this.status = 'pending'; // pending, confirmed, cancelled
    }

    // Generate a unique queue number
    generateQueueNumber() {
        const prefix = this.route === 'forward' ? 'F' : 'R';
        const randomNum = Math.floor(Math.random() * 9000) + 1000;
        const timeStamp = Date.now().toString().slice(-4);
        return `${prefix}${timeStamp}${randomNum}`;
    }

    // Get route display name
    getRouteDisplay() {
        return this.route === 'forward' 
            ? 'Ga Suối Mơ → Đỉnh Bà Nà' 
            : 'Đỉnh Bà Nà → Ga Suối Mơ';
    }

    // Validate ticket data
    isValid() {
        return this.customerName && 
               this.customerPhone && 
               this.numberOfTickets > 0 && 
               this.visitDate;
    }

    // Convert to JSON for storage
    toJSON() {
        return {
            id: this.id,
            route: this.route,
            customerName: this.customerName,
            customerPhone: this.customerPhone,
            customerEmail: this.customerEmail,
            numberOfTickets: this.numberOfTickets,
            visitDate: this.visitDate,
            notes: this.notes,
            queueNumber: this.queueNumber,
            createdAt: this.createdAt,
            status: this.status
        };
    }

    // Create from JSON
    static fromJSON(json) {
        const ticket = new Ticket(
            json.id,
            json.route,
            json.customerName,
            json.customerPhone,
            json.customerEmail,
            json.numberOfTickets,
            json.visitDate,
            json.notes
        );
        ticket.queueNumber = json.queueNumber;
        ticket.createdAt = new Date(json.createdAt);
        ticket.status = json.status;
        return ticket;
    }
}
