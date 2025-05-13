const asyncHandler = require("express-async-handler");
const {
  getAllStudents,
  addNewStudent,
  getStudentDetail,
  setStudentStatus,
  updateStudent,
} = require("./students-service");
const winston = require("winston");

// Configure Winston logger to log info and error messages to console.
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/app.log" }),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
  ],
});

const handleGetAllStudents = asyncHandler(async (req, res) => {
  const students = await getAllStudents(req.query);
  res.json({ students });
});

const handleAddStudent = asyncHandler(async (req, res) => {
  const payload = req.body;
  logger.info(`Adding new student with payload: ${JSON.stringify(payload)}`);
  try {
    const message = await addNewStudent(payload);
    res.json(message);
  } catch (error) {
    logger.error(`Failed to add student: ${error.message}`);
    throw error; // Let asyncHandler handle the error response
  }
});

const handleUpdateStudent = asyncHandler(async (req, res) => {
  const payload = { ...req.body, userId: req.params.id };
  const message = await updateStudent(payload);
  res.json(message);
});

const handleGetStudentDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const student = await getStudentDetail(id);
  res.json(student);
});

const handleStudentStatus = asyncHandler(async (req, res) => {
  const userId = req.params.id; // From URL: /:id/status
  const { status } = req.body; // From body: { status: "true | false" }
  const reviewerId = req.user?.id; // From auth middleware (e.g., JWT)

  logger.info(
    `Setting status of student ${userId} to "${status}" by reviewer ${reviewerId}`
  );

  const message = await setStudentStatus({ userId, reviewerId, status });
  res.json(message);
});

module.exports = {
  handleGetAllStudents,
  handleGetStudentDetail,
  handleAddStudent,
  handleStudentStatus,
  handleUpdateStudent,
};
