const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authenticateTeacher = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ error: 'Access denied, token is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const teacher = await prisma.teacher.findUnique({
      where: { id: decoded.id },
    });

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    // Attach the teacher's class info to the request
    req.teacher = teacher;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to authenticate token' });
  }
};

module.exports = authenticateTeacher;
