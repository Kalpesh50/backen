const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subject.controller');

router.get('/', subjectController.getSubjects);  // Get subjects by class
router.post('/', subjectController.addSubject);  // Add a new subject
router.put('/:subjectId', subjectController.editSubject);  // Edit an existing subject
router.delete('/:subjectId', subjectController.deleteSubject);  // Delete a subject

module.exports = router;