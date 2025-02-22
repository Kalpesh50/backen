const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');

router.get('/subjects/:className', attendanceController.getSubjectsByClass);
router.get('/students/:className', attendanceController.getStudentsByClass);
router.post('/mark', attendanceController.markAttendance);
router.get('/report', attendanceController.getAttendanceReport);
router.get('/first-lecture-absentees', attendanceController.getFirstLectureAbsentees);
router.post('/export-excel', attendanceController.getexcel)
router.get('/today' , attendanceController.getAttendanceOfToday);

module.exports = router; 