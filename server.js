import express from 'express';
// Import any necessary middleware and route files here
import routes from './routes/index'; // Assuming routes are defined in routes/index.js

const server = express();
const port = process.env.PORT || 5000;

// Middleware setup (uncomment if you have middleware functions)
// injectMiddlewares(server);

// Route setup
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use('/', routes); // Load routes

server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

// Export the server instance for testing or further use
export default server;
