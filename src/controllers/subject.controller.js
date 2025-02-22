const { PrismaClient } = require('@prisma/client');


const prisma = new PrismaClient()
// Get subjects by class
exports.getSubjects = async (req, res) => {
  const { class: className } = req.query;  // Get class from query params

  try {
    const subjects = await prisma.subject.findMany({
      where: { class: className },
    });
    res.status(200).json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Error fetching subjects' });
  }
};

// Add a new subject
exports.addSubject = async (req, res) => {
  const { name, type, class: className } = req.body;

  try {
    const newSubject = await prisma.subject.create({
      data: {
        name,
        type,
        class: className,
      },
    });
    res.status(201).json(newSubject);
  } catch (error) {
    console.error('Error adding subject:', error);
    res.status(500).json({ error: 'Error adding subject' });
  }
};

// Edit a subject
exports.editSubject = async (req, res) => {
  const { subjectId } = req.params;  // Get subject ID from URL
  const { name, type } = req.body;

  try {
    const updatedSubject = await prisma.subject.update({
      where: { id: Number(subjectId) },
      data: { name, type },
    });
    res.status(200).json(updatedSubject);
  } catch (error) {
    console.error('Error editing subject:', error);
    res.status(500).json({ error: 'Error editing subject' });
  }
};

// Delete a subject
exports.deleteSubject = async (req, res) => {
  const { subjectId } = req.params;

  try {
    await prisma.subject.delete({
      where: { id: Number(subjectId) },
    });
    res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({ error: 'Error deleting subject' });
  }
};
