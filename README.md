# EXPENSE-TRACKER
Here’s the updated `README.md` with sections for **User Authentication**, **Performance Optimization**, and **Error Handling**:

The Codebase has moved to other branch master in this repositry

---

# Daily Expenses Sharing Application

This project is a backend service for a **Daily Expenses Sharing Application** that allows users to add expenses and split them using three methods: **equal splits**, **exact amounts**, and **percentages**. Users can manage their details, add expenses, and retrieve individual and overall expenses. The application also provides a feature to download a **balance sheet** for tracking.

## Features
- **User Management**
  - Create users with email, name, and mobile number.
  - Retrieve user details.
  
- **Expense Management**
  - Add expenses and split them by:
    1. **Equal**: Split equally among all participants.
    2. **Exact**: Specify the exact amount each participant owes.
    3. **Percentage**: Specify the percentage each participant owes (ensuring percentages sum up to 100%).
  
- **Balance Sheet**
  - Retrieve individual and overall expenses.
  - Download a detailed balance sheet in a downloadable format.

- **User Authentication** (New)
  - Implement secure user authentication using **JWT** (JSON Web Tokens) to ensure that only authorized users can add or retrieve expenses.
  - Authorization ensures that only authenticated users can access their own data or the data they're allowed to view.

- **Performance Optimization** (New)
  - Optimize database queries to handle large datasets efficiently.
  - Implement **pagination** for expense retrieval to improve performance on endpoints like fetching all expenses.

- **Error Handling** (New)
  - Improve error handling to manage invalid inputs and unexpected errors across all API endpoints.
  - Provide user-friendly error messages and proper HTTP status codes for all API responses.

---

## API Endpoints

### User Endpoints
1. **Create User**
   - Endpoint: `/users`
   - Method: `POST`
   - Description: Creates a new user with email, name, and mobile number.
   - Payload:
     ```json
     {
       "name": "John Doe",
       "email": "john@example.com",
       "mobile": "1234567890",
       "password": "password123"
     }
     ```
     ![USER REGISTER](https://github.com/user-attachments/assets/722971b2-f319-4d88-a40b-31447fd17393)
2. **User Login**
   - Endpoint: `/users/login`
   - Method: `POST`
   - Description: Authenticates the user and returns a **JWT** token for secure access.
   - Payload:
     ```json
     {
       "email": "john@example.com",
       "password": "password123"
     }
     ```
     ![LOGIN](https://github.com/user-attachments/assets/52858075-d6aa-4913-8c8a-7505d91f5282)

3. **Retrieve User Details**
   - Endpoint: `/users/:id`
   - Method: `GET`
   - Description: Retrieves details of a specific user by ID (requires authentication).

### Expense Endpoints
1. **Add Expense** (Authenticated)
   - Endpoint: `/expenses`
   - Method: `POST`
   - Description: Add a new expense and split it based on the specified method (user must be authenticated).
   - Payload for Equal Split:
     ```json
     {
       "amount": 3000,
       "split_method": "equal",
       "participants": ["user1", "user2", "user3"]
     }
     ```
   - Payload for Exact Split:
     ```json
     {
       "amount": 4299,
       "split_method": "exact",
       "splits": [
         {"user": "user1", "amount": 799},
         {"user": "user2", "amount": 2000},
         {"user": "user3", "amount": 1500}
       ]
     }
     ```
   - Payload for Percentage Split:
     ```json
     {
       "amount": 5000,
       "split_method": "percentage",
       "splits": [
         {"user": "user1", "percentage": 50},
         {"user": "user2", "percentage": 25},
         {"user": "user3", "percentage": 25}
       ]
     }
     ```

2. **Retrieve Individual Expenses** (Authenticated)
   - Endpoint: `/expenses/user/:id`
   - Method: `GET`
   - Description: Retrieve all expenses associated with a specific user (with pagination support).

3. **Retrieve Overall Expenses** (Authenticated)
   - Endpoint: `/expenses`
   - Method: `GET`
   - Description: Retrieve all expenses across all users (with pagination support).

4. **Download Balance Sheet** (Authenticated)
   - Endpoint: `/balance-sheet`
   - Method: `GET`
   - Description: Download the overall balance sheet in a downloadable format (e.g., CSV or PDF).

---

## Security: User Authentication and Authorization

- **JWT Authentication**: 
  - Each user must log in using their email and password. After successful login, a JWT token is issued and must be included in the headers of each request that requires authentication.

- **Authorization**:
  - Only authenticated users are allowed to view or add expenses. Users can only view their own expenses and the ones they are involved in.

---

## Performance Optimization

- **Database Optimization**: 
  - Optimize queries for expense retrieval and user management to ensure that the application can handle large amounts of data efficiently.
  
- **Pagination**: 
  - For large datasets (especially expenses), implement pagination on expense retrieval endpoints. The API will return results in pages to improve performance:
    - Example: `/expenses?page=1&limit=10` will return the first 10 results.
  
---

## Error Handling and Input Validation

- **Input Validation**: 
  - Validate all incoming requests. For example:
    - Ensure percentages in the "percentage split" method add up to 100%.
    - Ensure proper email format when creating users.
    - Ensure that all required fields are present in requests.

- **Error Handling**:
  - Implement proper error handling to return appropriate HTTP status codes (e.g., `400` for bad requests, `401` for unauthorized access, etc.).
  - Return meaningful error messages to help users troubleshoot issues.

---

## Setup Instructions

### Prerequisites
- **Node.js** (version 14+)
- **MongoDB** (or any other database if you're using an ORM)
- **Postman** (optional, for testing API endpoints)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/NAIDU0019/EXPENSE-TRACKER.git
   cd EXPENSE-TRACKER
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root of the project.
   - Add the following variables (modify according to your setup):
     ```
     DB_CONNECTION_STRING=<your_database_connection_string>
     PORT=3000
     JWT_SECRET=<your_jwt_secret_key>
     ```

4. Start the server:
   ```bash
   npm start
   ```

5. Test the API using Postman or your preferred tool.

---

### Running Tests
- Run unit and integration tests (if implemented):
  ```bash
  npm test
  ```

---

## Future Enhancements
- Further optimize performance for very large datasets.
- Improve UX/UI with detailed API responses and better error reporting.

## License
This project is licensed under the MIT License.

---

