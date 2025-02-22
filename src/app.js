const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const attendanceRoutes = require('./routes/attendance.routes');
const authRoutes = require('./routes/auth.routes');
const teacherRouter = require('./routes/teacher.routes');
const studentRoutes = require('./routes/student.routes');
const subjectRoutes = require('./routes/subject.routes')


const app = express();
const prisma = new PrismaClient();

// Configure CORS
app.use(cors({
  origin: '*', // Allow all origins during development
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Routes
app.use('/api/attendance', attendanceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/class', teacherRouter);
app.use('/api/students', studentRoutes);
app.use('/api/subjects',subjectRoutes)


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});