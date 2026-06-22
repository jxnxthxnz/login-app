import app from './app';
import { env } from './config/env';
import { testDatabaseConnection } from './config/database';

const startServer = async () => {
  try {
    // Test database connection
    console.log('Testing database connection...');
    await testDatabaseConnection();

    // bind server to a port and start listening for http requests
    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`);
      console.log(`Environment: ${env.NODE_ENV}`);
      console.log(`Health check: http://localhost:${env.PORT}/health`);
      console.log(`API endpoint: http://localhost:${env.PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1); //exit code 1 error
  }
};

// Handle uncaught exceptions
// process is global nodejs object thats current running program
// .on() event listener
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
//reason - error it rejected with, promise - specific promise object that rejected
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();
