// Centralized logger utility for the Student Management System
const winston = require("winston");

const logEngine = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] <${level}> :: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/activity.log" }),
    new winston.transports.File({
      filename: "logs/failure.log",
      level: "error",
    }),
  ],
});

module.exports = logEngine;
