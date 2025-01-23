const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express(); // Initialize `app` here

// Middleware
app.use(bodyParser.json());
app.use(morgan('dev'));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'API documentation for the Task Management service',
    },
    servers: [
      {
        url: 'http://localhost:5000', // Update this to match your server's URL
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the route files where Swagger JSDoc annotations are present
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Use `app` after initialization

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Start the server
const PORT = process.env.PORT || 5000; // Fallback to 5000 if PORT is not defined in .env
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
