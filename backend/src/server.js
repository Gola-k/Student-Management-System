// Custom server entry point for Student Management System
// Author: (Your Name)

const { app } = require("./app.js");
const { env } = require("./config");
const morgan = require("morgan");
const winston = require("winston");

// Modular logger setup for flexibility
function initializeLogger() {
  return winston.createLogger({
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
      new winston.transports.File({ filename: "logs/failure.log", level: "error" }),
    ],
  });
}

const logEngine = initializeLogger();

// Custom Morgan format for concise HTTP logging
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: {
      write: (msg) => logEngine.info(msg.trim()),
    },
  })
);

const SERVER_PORT = env.PORT || 4000;

app.listen(SERVER_PORT, () => {
  logEngine.info(`🚀 Server launched successfully on port ${SERVER_PORT}`);
});

// Global error handlers for reliability
process.on("uncaughtException", (err) => {
  logEngine.error(`Fatal: Uncaught Exception! Details: ${err.stack || err.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logEngine.error(`Fatal: Unhandled Promise Rejection at: ${promise}, reason: ${reason}`);
});
