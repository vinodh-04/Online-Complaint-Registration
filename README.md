# Online Complaint Registration

## Technical Architecture
- **Frontend:** React.js, Material UI, Bootstrap, Axios
- **Backend:** Node.js, Express.js, Socket.io, WebRTC API
- **Database:** MongoDB


## System Features & Implementation Details

1. **User Registration & Profile Creation**
   - Secure sign-up using email and password with authentication protocols.
   - Stores user details including name, contact info, and ID for complaint tracking.

2. **Officer Browsing & Complaint Type Filtering**
   - Users can filter complaints by category or department (e.g., Police, Electricity, Municipality).
   - Real-time status tracking for complaints.

3. **Complaint Lodging & Management**
   - Easy complaint form for categories, descriptions, and document attachments.
   - Automated email/SMS notifications for submission and resolution updates.

4. **Officer's Dashboard**
   - Officers can view, filter, and update assigned complaints.
   - Secure action logging and resolution reporting.

5. **Admin Controls & Verification**
   - Approval system for officer accounts to maintain integrity.
   - Analytics access for monitoring, dispute resolution, and security.


# User Flow Documentation 

## 1. Customer/Ordinary User
*   **Role**: Create and manage complaints, interact with agents, and manage profile information.
*   **Registration and Login**: Create an account by providing necessary information such as email and password; log in using registered credentials.
*   **Complaint Submission**: Fill out the complaint form with details including description, contact information, and relevant attachments; submit for processing.
*   **Status Tracking**: View the status of submitted complaints in the dashboard or status section; receive real-time updates on progress.
*   **Interaction with Agents**: Connect with assigned agents directly using the messaging feature to discuss complaints and provide additional information.
*   **Profile Management**: Manage personal profile information, including details and addresses.

## 2. Agent
*   **Role**: Manage complaints assigned by the admin, communicate with customers, and update complaint statuses.
*   **Registration and Login**: Create an account using email and password; log in using registered credentials.
*   **Complaint Management**: Access the dashboard to view and manage complaints assigned by the admin and communicate with customers via the chat window.
*   **Status Update**: Change complaint statuses based on resolution or progress and provide updates to customers.
*   **Customer Interaction**: Respond to inquiries, resolve issues, and address customer feedback.

## 3. Admin
*   **Role**: Oversee overall platform operation, manage complaints, users, and agents, and enforce platform policies.
*   **Management and Monitoring**: Monitor and moderate all complaints; assign complaints to agents based on workload and expertise.
*   **Complaint Assignment**: Assign complaints to agents for resolution and ensure timely, efficient handling.
*   **User and Agent Management**: Manage accounts (registration, login, profile info) and enforce privacy regulations and terms of service.
*   **Continuous Improvement**: Implement measures to improve platform functionality, security, and user experience, while addressing feedback for better service delivery.


# MVC Architectural Pattern - Online Complaint Registration

The backend application follows the Model-View-Controller (MVC) architectural pattern to ensure modularity, maintainability, and scalability.

## Layers
* **Model Layer (Data Layer)**: Handles all data-related logic, including database schemas defined using Mongoose for MongoDB.
* **Controller Layer**: Acts as an intermediary; it receives incoming requests, processes input, calls appropriate model methods, and returns responses.
* **View Layer (Routing Layer)**: Implemented as the routing layer for the REST API, defining endpoints (GET, POST, PUT, DELETE) that invoke controller functions.

## Advantages
* **Separation of Concerns**: Clearly defined responsibilities improve readability.
* **Scalability**: New features are easily added via new routes, controllers, and models.
* **Reusability**: Logic can be reused across the application.
* **Testing**: Each layer can be tested independently.
* **Collaboration-Friendly**: Developers can work on different layers simultaneously without conflict.

## Roles and Responsibilities
1. **User Registration**: Citizens register with email, phone, and password to lodge complaints.
2. **Browsing & Lodging**: Users browse categories and submit complaints with issue details and images.
3. **Admin Approval**: Admins review backend access, verify officials, and monitor for spam.
4. **Officer Task Management**: Assigned officers track, update status, and resolve complaints in the system.