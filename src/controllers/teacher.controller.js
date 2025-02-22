const { PrismaClient } = require('@prisma/client');

// Create a new class teacher
const prisma = new PrismaClient();


exports.createTeacher = async (req, res) => {
    const { name, username, password, class: className } = req.body;
  
    try {
      // Check if a teacher already exists for the selected class
      const existingTeacher = await prisma.teacher.findFirst({
        where: {
          class: className,
        },
      });
  
      if (existingTeacher) {
        return res.status(400).json({ error: 'Class already has a teacher.' });
      }
  
      const teacher = await prisma.teacher.create({
        data: {
          name,
          username,
          password,
          class: className,
        },
      });
  
      res.status(201).json(teacher);
    } catch (error) {
      console.error('Error creating teacher:', error);
      res.status(500).json({ error: 'Error creating teacher' });
    }
  };
  

// Update a teacher's username and password
exports.updateTeacher = async (req, res) => {
  const { username, password } = req.body;
  const { teacherId } = req.params;

  try {
    // Update the teacher's username and password
    const updatedTeacher = await prisma.teacher.update({
      where: { id: Number(teacherId) },
      data: { username, password },
    });

    return res.status(200).json(updatedTeacher);
  } catch (error) {
    console.error('Error updating teacher:', error);
    return res.status(500).json({ error: 'Error updating teacher' });
  }
};

// Delete a teacher
exports.deleteTeacher = async (req, res) => {
  const { teacherId } = req.params;

  try {
    // Delete the teacher by ID
    const deletedTeacher = await prisma.teacher.delete({
      where: { id: Number(teacherId) },
    });

    return res.status(200).json(deletedTeacher);
  } catch (error) {
    console.error('Error deleting teacher:', error);
    return res.status(500).json({ error: 'Error deleting teacher' });
  }
};

// Fetch all teachers
exports.getTeachers = async (req, res) => {
  try {
    // Fetch all teachers
    const teachers = await prisma.teacher.findMany();

    return res.status(200).json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return res.status(500).json({ error: 'Error fetching teachers' });
  }
};
