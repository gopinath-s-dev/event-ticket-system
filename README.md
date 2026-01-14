**Event & Ticket System API**:
A production-ready, secure RESTful API for managing events and ticket bookings with dual database architecture (MySQL + MongoDB).

**Architecture Overview**:
This system demonstrates the ability to connect and utilize two different databases within a single application:
1.MySQL (Relational): Handles User Accounts and Bookings where relationships and ACID compliance are critical
2.MongoDB (Document): Manages Event Details with flexible schemas and System Logs

**Design Decision**:
Why This Architecture?
This dual-database architecture was chosen to demonstrate polyglot persistence and leverage the strengths of both database types:
MySQL for Transactional Data:
User accounts require strict referential integrity and ACID compliance
Bookings involve complex relationships (User ↔ Booking ↔ Event)
Foreign key constraints ensure data consistency
Row-level locking prevents race conditions in concurrent booking scenarios
Transaction support allows atomic operations across multiple tables

**MongoDB for Flexible Document Storage:**
Event details have dynamic, evolving schemas (metadata field can contain any structure)
Flexible metadata allows for future additions without schema migrations
High-write operations for system logs benefit from MongoDB's write performance
Document model naturally represents event data with nested information (speakers, tags, etc.)
Atomic update operations ($inc) provide efficient concurrency handling for ticket availability

**Sequelize ORM Choice:**
Excellent transaction support crucial for booking operations
Built-in connection pooling and query optimization
Clear model definitions improve code maintainability

**Service Layer Pattern:**
Separates business logic from HTTP handlers
BookingService orchestrates cross-database transactions
Centralized error handling and rollback logic
Easier to test and maintain
Promotes code reusability

**Features:**
User Management: Registration and authentication with JWT
Event Management: CRUD operations for events (Admin only)
Booking System: Atomic ticket booking with concurrency handling
Security: Comprehensive security measures including rate limiting, input sanitization, and CORS
Logging: Structured logging in MongoDB for audit trails
Error Handling: Global error handling middleware

**Setup Instructions**

1.Clone the repository:
   git clone <repository-url>
   cd event-ticket-system

2.Install dependencies:
npm install

3.Configure environment variables

4.Setup MySQL database:
mysql -u root -p
SOURCE path

5.Start the server

# Development mode cmd:
npm run dev

# Production mode cmd:
npm start

**API Documentation**
**Base URL**
http://localhost:3000/api

**Authentication**
All booking operations require a valid JWT token. Include it in the Authorization header:
Authorization: Bearer <your_jwt_token>

**Endpoints**
**POST /api/auth/create-admin**
Create a new admin
Body:
json{
"name": "Admin",
"email": "admin@example.com",
"password": "admin@1234"
}

**POST /api/auth/create-user**
Create a new user
Body:
json{
"name": "John Doe",
"email": "john@example.com",
"password": "SecurePass@123"
}

**POST /api/auth/login**
Login and receive JWT token
Body:
json{
"email": "john@example.com",
"password": "SecurePass@123"
}

**GET /api/auth/user-profile(Requires: Authentication)**
Get current user profile

**Events
GET /api/events/paginate**
List all events with pagination
Requires: Authentication
Query params: page, limit
Example: /api/events/paginate?page=1&limit=10

**GET /api/events/:id/fetchById**
Requires: Authentication
Get event by ID

**POST /api/events/create-event**
Create a new event (Admin only)
Requires: Authentication + Admin
Json Body:
{
"title": "Tech Conference 2024",
"description": "Annual technology conference",
"date": "2024-12-31T10:00:00Z",
"location": "Convention Center, NYC",
"totalTickets": 500,
"metadata": {
"speakers": ["John Doe", "Jane Smith"],
"tags": ["tech", "innovation"]
}
}

**PUT /api/events/:id/update-event**
Update an event (Admin only)
Requires: Authentication + Admin
Json Body:
{
"title": "Tech Conference 2024",
"description": "Annual technology conference - 2024",
}


**Bookings
POST /api/bookings/create-booking**
Requires: Authentication
Book a ticket for an event
Json Body:
{
"eventId": "507f1f77bcf86cd799439011"
}

**DELETE /api/bookings/bookingId/cancel-booking**
Requires: Authentication
Cancel a ticket for an event
Params: 2 (/api/bookings/2/cancel-booking)



**GET /api/bookings/my-bookings/paginate**
Get user's bookings
Requires: Authentication
Query params: page, limit
