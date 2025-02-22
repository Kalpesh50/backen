const express = require('express');
const { loginHOD, loginTeacher } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/login/hod', loginHOD);
router.post('/login/teacher', loginTeacher);

module.exports = router;
