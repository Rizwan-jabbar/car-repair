# AutoSphere: Web-Based Car Repair and Service Booking Platform

## 1. Abstract
This project presents **AutoSphere**, a full-stack web application for car repair service management.  
The platform solves common workshop problems such as manual booking, poor communication, and non-transparent service tracking.  
Customers can register, log in, view services, submit booking requests, contact support, and leave reviews.  
Admins can manage services, FAQs, banners, bookings, contacts, and review visibility through a dedicated admin panel.  
The system is built with React, Redux Toolkit, Tailwind CSS, Node.js, Express.js, MongoDB, and Mongoose.  
Role-based authorization and JWT authentication are implemented to secure user and admin workflows.

## 2. Introduction
Traditional car workshops often rely on phone calls and paper logs, which creates delays and data inconsistency.  
AutoSphere digitizes the complete flow from booking to status updates and customer feedback.

This thesis documents:
- problem statement and goals
- system architecture and implementation
- database design and ERD
- testing and evaluation
- limitations and future improvements

## 3. Problem Statement
Existing workshop management in many local environments has the following issues:
- no centralized digital booking system
- poor booking status visibility for customers
- unstructured storage for reviews and inquiries
- weak content management for services and promotional banners
- limited role-based access for admin operations

## 4. Objectives
- Build a responsive web platform for car service booking.
- Provide secure authentication and role-based access control.
- Allow admins to manage services, FAQs, bookings, and content.
- Improve communication using contact and feedback modules.
- Maintain a scalable backend with structured API routes.

## 5. Scope
### In Scope
- customer registration/login
- service listing and availability
- booking creation and booking status management
- customer reviews and admin moderation
- contact form and admin-side inquiry view
- banner and FAQ management

### Out of Scope
- online payment gateway
- live mechanic GPS tracking
- native Android/iOS application

## 6. Technology Stack
### Frontend
- React (Vite)
- Redux Toolkit + React Redux
- React Router DOM
- Tailwind CSS
- Framer Motion
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcrypt
- Multer (image upload)

## 7. Methodology
An iterative development approach was used:
1. Define modules (Auth, Services, Booking, Reviews, Contact, Admin).
2. Create database schemas and route contracts.
3. Implement frontend pages with protected route logic.
4. Integrate API and state management.
5. Validate through module-level manual testing.
6. Polish UI/UX and optimize role-specific workflows.

## 8. System Architecture
AutoSphere follows a layered architecture:
- **Presentation Layer:** React pages/components and routing
- **Application Layer:** Redux slices/thunks and API integration
- **Service Layer:** Express controllers and middleware
- **Data Layer:** MongoDB collections managed with Mongoose schemas

Request flow:
1. Client sends API request.
2. Middleware validates token and role.
3. Controller validates payload and executes business logic.
4. Mongoose interacts with database.
5. Response returns to client and UI updates via Redux state.

## 9. Module Design
### 9.1 Authentication Module
- User registration and login
- JWT issue and validation
- `authMiddleWare` for protected routes
- role checks with `roleAuthMiddleWare`

### 9.2 Service Module
- Admin can add, update, delete, and toggle service availability
- Users can browse all available services

### 9.3 Booking Module
- Authenticated users create bookings
- Admin can view all bookings, change status, and set arrival details

### 9.4 Review Module
- Users can submit reviews (optional auth supported)
- Admin can toggle visibility or delete inappropriate reviews

### 9.5 Contact Module
- Public contact form for customer inquiries
- Admin dashboard for viewing submitted contacts

### 9.6 Content Module
- FAQ CRUD for admin
- Banner create/update with image upload for homepage content

## 10. Database Design Summary
Main collections:
- `users`
- `services`
- `bookings`
- `reviews`
- `contacts`
- `faqs`
- `banners`

Key relationships:
- One user can create many bookings.
- One user can submit many reviews.
- Booking and review can store selected service name as text.
- Admin role controls management operations for all modules.

Detailed ERD is provided in [ERD.md](d:\car-repair\thesis\ERD.md).

## 11. Security Design
- Password hashing using bcrypt
- Token-based authentication using JWT
- Route-level auth middleware
- Role-based access control for admin-only operations
- Validation constraints in Mongoose schemas

## 12. Testing and Validation
Testing focused on functional behavior:
- auth flow (register/login/current user)
- role restrictions on admin routes
- booking create and status update flow
- service CRUD and availability toggle
- review moderation and visibility
- contact submission and retrieval

Build validation:
- frontend production build via `vite build`
- API route behavior checked through module requests

## 13. Results
The platform successfully delivers:
- structured service booking workflow
- reduced dependency on manual communication
- centralized admin operations
- improved customer interaction through reviews and contact channel

## 14. Limitations
- No integrated payment process
- No analytics dashboard (conversion, repeat customer metrics)
- No real-time notifications (email/SMS/push)
- Manual deployment/monitoring pipeline not yet documented

## 15. Future Work
- payment gateway integration
- automated notifications (email/SMS/WhatsApp)
- predictive service suggestions using historical booking data
- stronger testing suite (unit + integration + e2e)
- performance monitoring and CI/CD pipeline

## 16. Conclusion
AutoSphere demonstrates how a modern full-stack web application can digitize workshop operations and improve both customer experience and administrative control.  
The project is scalable and practical, and provides a strong base for future enterprise-grade enhancements.

## 17. Suggested References (Format Placeholder)
1. MongoDB Documentation  
2. Express.js Documentation  
3. React Documentation  
4. Redux Toolkit Documentation  
5. JWT RFC 7519  
6. Tailwind CSS Documentation

