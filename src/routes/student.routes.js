const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');

router.post('/upload', studentController.uploadStudents);

router.get('/batches/:classname', studentController.getBatches)

// Get all students for a specific class (e.g., TY)
router.get('/', studentController.getStudents);

// Add a new student
router.post('/', studentController.addStudent);

// Update a student's details
router.put('/:studentId', studentController.updateStudent);

// Delete a student
router.delete('/:studentId', studentController.deleteStudent);

module.exports = router;
