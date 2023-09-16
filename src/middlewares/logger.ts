import winston from 'winston';

// Create a logger instance
const logger = winston.createLogger({
  level: 'info', // Set the logging level
  format: winston.format.json(), // Use JSON format for log entries
  transports: [
    // Output logs to the console
    new winston.transports.Console(),
    // Output logs to a file
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

export default logger;
