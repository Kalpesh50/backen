const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.loginHOD = async (req, res) => {
  const { username, password } = req.body;

  try {
    const hod = await prisma.hOD.findUnique({ where: { username } });

    if (!hod || hod.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: hod.id, username: hod.username }, process.env.JWT_SECRET, { expiresIn: '48h' });

    res.json({ token });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.loginTeacher = async (req, res) => {
  const { username, password } = req.body;

  try {
    const teacher = await prisma.teacher.findUnique({ where: { username } });

    if (!teacher || teacher.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: teacher.id, username: teacher.username }, process.env.JWT_SECRET, { expiresIn: '48h' });

    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
