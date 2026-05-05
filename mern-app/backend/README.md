# Backend Documentation for MERN App

## Overview
This is the backend for the MERN stack application. It is built using Node.js, Express, and MongoDB. The backend handles API requests, manages data, and connects to the MongoDB database.

## Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- MongoDB (local or cloud instance)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the backend directory:
   ```
   cd mern-app/backend
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Configuration
- Create a `.env` file in the `backend` directory and add your MongoDB connection string:
  ```
  MONGODB_URI=<your_mongodb_connection_string>
  ```

### Running the Application
To start the backend server, run:
```
npm start
```
The server will run on `http://localhost:5000` by default.

## API Endpoints

### Items
- **GET /api/items**: Retrieve all items.
- **POST /api/items**: Create a new item.
- **PUT /api/items/:id**: Update an existing item.
- **DELETE /api/items/:id**: Delete an item.

### Users
- **GET /api/users**: Retrieve all users.
- **POST /api/users**: Create a new user.

## Folder Structure
- `src/app.js`: Entry point for the backend application.
- `src/controllers`: Contains business logic for handling requests.
- `src/models`: Defines Mongoose models for MongoDB collections.
- `src/routes`: Sets up API endpoints and connects them to controllers.

## License
This project is licensed under the MIT License.