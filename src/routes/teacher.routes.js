// routes/teacherRouter.js

const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacher.controller');

// Route to fetch all teachers
router.get('/teachers', teacherController.getTeachers);

// Route to create a new class teacher
router.post('/teachers', teacherController.createTeacher);

// Route to update an existing teacher
router.put('/teachers/:teacherId', teacherController.updateTeacher);

// Route to delete a teacher
router.delete('/teachers/:teacherId', teacherController.deleteTeacher);

module.exports = router;
