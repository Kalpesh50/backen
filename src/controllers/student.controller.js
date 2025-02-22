const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');

const authenticateTeacher = require('../middleware/authenticateTeacher')


// Create a new class teacher
const prisma = new PrismaClient();

exports.getStudents = [
    async (req, res) => {
      const { class: className } = req.query;  // Get class from query params
  
      try {
        const students = await prisma.student.findMany({
          where: { class: className },  // Fetch students by class
        });
        res.status(200).json(students);
      } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Error fetching students' });
      }
    }
  ];



  exports.getBatches = [
    async (req, res) => {
      const { class: className } = req.query;  // Get class from query params
  
      try {
        const batches = await prisma.student.findMany({
          where: { class: className },
          select: { batch: true },
          distinct: ['batch'],
        });
    
        // Map the result to return only the batch names
        const batchNames = batches.map(batch => batch.batch);
    
        res.status(200).json(batchNames);
      } catch (error) {
        console.error('Error fetching batches:', error);
        res.status(500).json({ error: 'Failed to fetch batches' });
      }
    
    }
  ];
  
  // Route to upload students to a specific class
  exports.addStudent = [
    async (req, res) => {
      const { students, class: className } = req.body;  // Get students and class from request body
  
      try {
        const createdStudents = await prisma.student.createMany({
          data: students.map(student => ({
            ...student,
            class: className,  // Set the class for all uploaded students
          })),
        });
        res.status(201).json(createdStudents);
      } catch (error) {
        console.error('Error adding students:', error);
        res.status(500).json({ error: 'Error adding students' });
      }
    }
  ];

// Update a student's details
exports.updateStudent = async (req, res) => {
  const { studentId } = req.params;
  const { name, rollNo, batch } = req.body;

  try {
    const updatedStudent = await prisma.student.update({
      where: { id: Number(studentId) },
      data: { name, rollNo, batch },
    });
    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Error updating student' });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    const deletedStudent = await prisma.student.delete({
      where: { id: Number(studentId) },
    });
    res.status(200).json(deletedStudent);
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Error deleting student' });
  }
};

exports.uploadStudents = async (req, res) => {
    const { students, class: className } = req.body;
  
    try {
      const studentPromises = students.map(async (student) => {
        return prisma.student.create({
          data: {
            rollNo: student.rollNo,
            name: student.name,
            batch: student.batch,
            class: className, // Use the class provided (from teacher's context)
          },
        });
      });
  
      // Execute all promises to insert the students
      const createdStudents = await Promise.all(studentPromises);
  
      res.status(201).json(createdStudents);
    } catch (error) {
      console.error('Error processing uploaded students:', error);
      res.status(500).json({ error: 'Error processing uploaded students' });
    }
  };
  