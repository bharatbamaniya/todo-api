# Todo List API

This API allows users to create, read, update, and delete todo items.

## Environment

This project was developed with the following environment:

- Node.js: v22.11.0 or higher
- npm: 10.9.0 or higher

## Installation

1. Clone the repository: `git clone https://github.com/bharatbamaniya/todo-api.git`
2. Install dependencies: `npm install`
3. Create a `.env` file with the following variables mentioned in the `sample.env` file
4. Start the server: `npm start` or `npm run start:dev` (for development purpose only)

## API Endpoints

Postman collection is available in root directory.

- **Auth**
    - `/api/v1/signup`: Register a new user
    - `/api/v1/login`: Login a user
- **Todos**
    - `/api/v1/todos`:
        - POST: Create a new todo item (requires authentication)
        - GET: Get all todos for the authenticated user (requires authentication)
        - GET/:id: Get a specific todo (requires authentication)
        - PATCH/:id: Update a todo (requires authentication)
        - DELETE/:id: Delete a todo (requires authentication)

## Authentication

Authentication is required for all todo-related endpoints.
Use the JWT token obtained from the login endpoint in the `Authorization` header.

## Technologies Used

- Node.js
- Express.js
- Mongoose
- TypeScript
- Jest (for testing)
