# Full-Stack Coding Challenge

**Deadline**: Sunday, Feb 23th 11:59 pm PST

---

## Overview

Create a “Task Management” application with **React + TypeScript** (frontend), **Node.js** (or **Nest.js**) (backend), and **PostgreSQL** (database). The application should:

1. **Register** (sign up) and **Log in** (sign in) users.
2. After logging in, allow users to:
   - **View a list of tasks**.
   - **Create a new task**.
   - **Update an existing task** (e.g., mark complete, edit).
   - **Delete a task**.

Focus on **correctness**, **functionality**, and **code clarity** rather than visual design.  
This challenge is intended to be completed within ~3 hours, so keep solutions minimal yet functional.

---

## Requirements

### 1. Authentication

- **User Model**:
  - `id`: Primary key
  - `username`: Unique string
  - `password`: Hashed string
- **Endpoints**:
  - `POST /auth/register` – Create a new user
  - `POST /auth/login` – Login user, return a token (e.g., JWT)
- **Secure the Tasks Routes**: Only authenticated users can perform task operations.  
  - **Password Hashing**: Use `bcrypt` or another hashing library to store passwords securely.
  - **Token Verification**: Verify the token (JWT) on each request to protected routes.

### 2. Backend (Node.js or Nest.js)

- **Tasks CRUD**:  
  - `GET /tasks` – Retrieve a list of tasks (optionally filtered by user).  
  - `POST /tasks` – Create a new task.  
  - `PUT /tasks/:id` – Update a task (e.g., mark as complete, edit text).  
  - `DELETE /tasks/:id` – Delete a task.
- **Task Model**:
  - `id`: Primary key
  - `title`: string
  - `description`: string (optional)
  - `isComplete`: boolean (default `false`)
  - _(Optional)_ `userId` to link tasks to the user who created them
- **Database**: PostgreSQL
  - Provide instructions/migrations to set up:
    - `users` table (with hashed passwords)
    - `tasks` table
- **Setup**:
  - `npm install` to install dependencies
  - `npm run start` (or `npm run dev`) to run the server
  - Document any environment variables (e.g., database connection string, JWT secret)

### 3. Frontend (React + TypeScript)

- **Login / Register**:
  - Simple forms for **Register** and **Login**.
  - Store JWT (e.g., in `localStorage`) upon successful login.
  - If not authenticated, the user should not see the tasks page.
- **Tasks Page**:
  - Fetch tasks from `GET /tasks` (including auth token in headers).
  - Display the list of tasks.
  - Form to create a new task (`POST /tasks`).
  - Buttons/fields to update a task (`PUT /tasks/:id`).
  - Button to delete a task (`DELETE /tasks/:id`).
- **Navigation**:
  - Show `Login`/`Register` if not authenticated.
  - Show `Logout` if authenticated.
- **Setup**:
  - `npm install` then `npm start` (or `npm run dev`) to run.
  - Document how to point the frontend at the backend (e.g., `.env` file, base URL).

---

## Prerequisites
Before you begin, ensure you have the following installed:

- **Node.js** (Latest LTS version recommended)
- **npm** or **yarn** (Package manager)
- **PostgreSQL** (Database)
- **Git** (For version control)

## Setup Instructions

### 1. Clone the Repository
```sh
git clone https://github.com/harshil1111999/lumaa-spring-2025-swe.git
cd lumaa-spring-2025-swe
```

---
## Database Setup

### 2. Create the Database
Ensure PostgreSQL is running:
When you will start the server it will automatically create the db and table if not exist

### 3. Set Up Environment Variables
Create a `.env` file in the **backend** directory and add:
```env
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<dbname>
DB_USER=<username>
DB_PASSWORD=<password>
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key
PORT=3001
NODE_ENV=development
```

---
## Backend Setup

### 4. Navigate to the Backend Directory
```sh
cd backend
```

### 5. Install Dependencies
```sh
npm install
```

### 6. Start the Backend Server
For development mode (with hot reloading):
```sh
npm run dev
```
For production mode:
```sh
npm start
```
The backend will run on **http://localhost:3001** by default.

---
## Frontend Setup

### 7. Navigate to the Frontend Directory
```sh
cd ../frontend
```

### 8. Install Dependencies
```sh
npm install
```

### 9. Configure Environment Variables
Create a `.env` file in the **frontend** directory and add:
```env
REACT_APP_API_URL=http://localhost:<port>
```

### 10. Start the Frontend Server
For development mode:
```sh
npm start
```
The frontend will run on **http://localhost:3000** by default.

---
## Running the Project
After starting both frontend and backend servers, open your browser and navigate to:
```
http://localhost:3000
```
Ensure both frontend and backend are properly connected.

---
## Testing
Run tests using Jest (if configured):
```sh
npm test
```

---
## Salary Expectations (Mandatory)
My salary expectation is 60000 USD per annum!

---
## Short Video Demo
https://drive.google.com/file/d/1N5kueAB6OZDN-V_IuFaU51sE-JrEhpV4/view?usp=drive_link

---
## Project Structure
```
task-management/
│── backend/        # Node.js Backend
│   ├── src/
│   |   ├── config/
│   |   ├── middleware/
│   |   ├── routes/
│   |   ├── types/
|   |   ├── utils/
│   ├── index.ts
|   ├── .env
|   ├── package.json
│── frontend/       # React TypeScript Frontend
│   ├── src/
│   |   ├── components/
│   |   ├── context/
│   |   ├── hooks/
│   |   ├── types/
│   |   ├── utils/
│   ├── App.tsx
│── README.md       # Documentation
```

---
## Additional Commands
### Linting & Formatting
Run ESLint and Prettier (if configured):
```sh
npm run lint
npm run format
```

### Build Frontend for Production
```sh
npm run build
```