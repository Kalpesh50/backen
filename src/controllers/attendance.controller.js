const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');
const path = require('path');
const ExcelJS = require('exceljs');
const fs = require('fs');
const nodemailer = require('nodemailer');

const prisma = new PrismaClient();

exports.markAttendance = async (req, res) => {
  try {
    const { date, time, subjectId, attendanceData, className } = req.body;

    // Convert date string to Date object without time component
    

    console.log('Received request for:', {
      subjectId,
      className,
      date,
      time
    });

    // Get subject details first with strict check
    const subject = await prisma.subject.findUnique({
      where: { 
        id: parseInt(subjectId) // Ensure subjectId is a number
      }
    });

    if (!subject) {
      throw new Error(`Subject not found for ID: ${subjectId}`);
    }

    console.log('Found subject:', subject);

    // Save current attendance using upsert
    await Promise.all(
      attendanceData.map(async (data) => {
        return prisma.attendance.upsert({
          where: {
            studentId_subjectId_date_time: {
              studentId: data.studentId,
              subjectId: parseInt(subjectId),
              date: date,
              time: time
            }
          },
          update: {
            isPresent: data.isPresent
          },
          create: {
            date: date,
            time: time,
            isPresent: data.isPresent,
            studentId: data.studentId,
            subjectId: parseInt(subjectId)
          }
        });
      })
    );

    // Get all students of specific class
    const students = await prisma.student.findMany({
      where: {
        AND: [
          {
            id: {
              in: attendanceData.map(d => d.studentId)
            }
          },
          {
            class: className
          }
        ]
      },
      orderBy: {
        rollNo: 'asc'
      }
    });

    console.log(`Found ${students.length} students for class ${className}`);

    // Get attendance records ONLY for this specific subject and class
    const allAttendance = await prisma.attendance.findMany({
      where: {
        AND: [
          {
            student: {
              class: className
            }
          },
          {
            subjectId: parseInt(subjectId) // Strict subject filtering
          }
        ]
      },
      include: {
        student: true
      },
      orderBy: [
        { date: 'asc' },
        { student: { rollNo: 'asc' } }
      ]
    });

    console.log(`Found ${allAttendance.length} attendance records for subject ${subject.name}`);

    // Create the current date key
    const currentDateKey = `${new Date(date).toISOString().split('T')[0]} (${time})`;

    // Get unique dates including the current date
    const uniqueDates = [...new Set([
      currentDateKey,
      ...allAttendance.map(record => 
        `${record.date.toISOString().split('T')[0]} (${record.time})`
      )
    ])].sort();

    console.log('Unique dates:', uniqueDates);

    // Create attendance lookup including current attendance
    const attendanceLookup = {};
    
    // Add current day's attendance
    attendanceData.forEach(data => {
      if (!attendanceLookup[data.studentId]) {
        attendanceLookup[data.studentId] = {};
      }
      attendanceLookup[data.studentId][currentDateKey] = data.isPresent ? 1 : 0;
    });

    // Add historical attendance
    allAttendance.forEach(record => {
      const dateKey = `${record.date.toISOString().split('T')[0]} (${record.time})`;
      if (!attendanceLookup[record.studentId]) {
        attendanceLookup[record.studentId] = {};
      }
      attendanceLookup[record.studentId][dateKey] = record.isPresent ? 1 : 0;
    });

    // Prepare Excel data
    const excelData = [
      // Header rows
      {
        'Roll No': '',
        'Student Name': `Class: ${className}`,
        ...Object.fromEntries(uniqueDates.map(date => [date, '']))
      },
      {
        'Roll No': '',
        'Student Name': `Subject: ${subject.name}`,
        ...Object.fromEntries(uniqueDates.map(date => [date, '']))
      },
      {
        'Roll No': '',
        'Student Name': '',
        ...Object.fromEntries(uniqueDates.map(date => [date, '']))
      },
      // Student data
      ...students.map(student => {
        const rowData = {
          'Roll No': student.rollNo,
          'Student Name': student.name,
        };

        uniqueDates.forEach(dateKey => {
          rowData[dateKey] = attendanceLookup[student.id]?.[dateKey] ?? 'N/A';
        });

        return rowData;
      })
    ];

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const colWidths = [
      { wch: 10 },
      { wch: 20 },
      ...uniqueDates.map(() => ({ wch: 15 }))
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, `${className}_${subject.name}`);

    // Generate filename
    const filename = `attendance_${className}_${subject.name}_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // Send response
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.send(buffer);

  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
};

exports.getSubjectsByClass = async (req, res) => {
  try {
    const { className } = req.params;
    const subjects = await prisma.subject.findMany({
      where: { class: className },
      select: {
        id: true,
        name: true,
        type: true,
        class: true
      }
    });
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
};




exports.getStudentsByClass = async (req, res) => {
  try {
    const { className } = req.params;
    
    const students = await prisma.student.findMany({
      where: {
        class: className
      },
      orderBy: {
        rollNo: 'asc'
      }
    });

    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

exports.getAttendanceReport = async (req, res) => {
  try {
    const { className, date } = req.query;
    console.log('Fetching report for:', { className, date });
    
    // Convert to Date object without time component
  
    
    const attendance = await prisma.attendance.findMany({
      where: {
        date: date,
        student: {
          class: className
        }
      },
      include: {
        student: {
          select: {
            id: true,
            rollNo: true,
            name: true,
            class: true
          }
        },
        subject: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      },
      orderBy: [
        { time: 'asc' },
        { student: { rollNo: 'asc' } }
      ]
    });

    console.log('Found attendance records:', attendance.length);
    
    if (attendance.length === 0) {
      return res.json({
        message: 'No attendance records found for this date and class',
        data: []
      });
    }

    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance report:', error);
    res.status(500).json({ error: 'Failed to fetch attendance report' });
  }
};

// Add this new endpoint to check first lecture absences
exports.getFirstLectureAbsentees = async (req, res) => {
  try {
    const { date, className } = req.query;

    // Get the earliest lecture's attendance for the given date
    const firstLectureAttendance = await prisma.attendance.findMany({
      where: {
        date: new Date(date),
        student: {
          class: className
        }
      },
      include: {
        student: true
      },
      orderBy: {
        time: 'asc'
      }
    });

    // Get the earliest time for that date
    const earliestTime = firstLectureAttendance[0]?.time;
    
    if (!earliestTime) {
      return res.json({ absentees: [] });
    }

    // Get students who were absent in the first lecture
    const absentStudents = firstLectureAttendance
      .filter(record => record.time === earliestTime && !record.isPresent)
      .map(record => record.student.rollNo);
    console.log('Absent students:', absentStudents);

    res.json({ absentees: absentStudents });
  } catch (error) {
    console.error('Error getting first lecture absentees:', error);
    res.status(500).json({ error: 'Failed to get first lecture absentees' });
  }
}; 

const transporter = nodemailer.createTransport({
  secure:true,
  host:'smtp.gmail.com',
  port: 465,
  
  auth: {
    user: 'kalpeshdeore25@gmail.com', // Replace with your Gmail
    pass: 'qwbaojbzgucjkruh'
  }
});


exports.getexcel = async (req, res) => {
  const { className, subjectId, email } = req.body;

  try {
    console.log('Starting export process for:', { className, subjectId, email });

    // Get subject details
    const subject = await prisma.subject.findUnique({
      where: {
        id: parseInt(subjectId)
      }
    });

    if (!subject) {
      throw new Error('Subject not found');
    }

    console.log('Found subject:', subject);

    // Get all students for the class
    const students = await prisma.student.findMany({
      where: {
        class: className
      },
      orderBy: {
        rollNo: 'asc'
      }
    });

    console.log(`Found ${students.length} students`);

    // Get all attendance records
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        AND: [
          {
            subjectId: parseInt(subjectId)
          },
          {
            student: {
              class: className
            }
          }
        ]
      }
    });

    console.log(`Found ${attendanceRecords.length} attendance records`);

    // Get unique dates
    const dates = [...new Set(attendanceRecords.map(record => 
      record.date.toISOString().split('T')[0]
    ))].sort();

    console.log('Unique dates:', dates);

    // Create attendance lookup map
    const attendanceLookup = {};
    attendanceRecords.forEach(record => {
      const dateStr = record.date.toISOString().split('T')[0];
      if (!attendanceLookup[record.studentId]) {
        attendanceLookup[record.studentId] = {};
      }
      attendanceLookup[record.studentId][dateStr] = record.isPresent;
    });

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attendance');

    // Add title row
    worksheet.addRow([`Attendance Report for ${className} - ${subject.name}`]);
    worksheet.mergeCells(`A1:${String.fromCharCode(67 + dates.length)}1`);

    // Add headers
    const headers = ['Roll No', 'Name', ...dates];
    worksheet.addRow(headers);

    // Style headers
    worksheet.getRow(2).font = { bold: true };
    worksheet.getRow(2).alignment = { vertical: 'middle', horizontal: 'center' };

    // Add student data
    students.forEach(student => {
      const row = [
        student.rollNo,
        student.name
      ];

      // Add attendance for each date
      dates.forEach(date => {
        const studentAttendance = attendanceLookup[student.id]?.[date];
        if (studentAttendance === undefined) {
          row.push('-');
        } else {
          row.push(studentAttendance ? 1 : 0);
        }
      });

      worksheet.addRow(row);
    });

    // Style all cells
    worksheet.columns.forEach(column => {
      column.width = 12;
    });
    worksheet.getColumn(2).width = 20; // Name column wider

    // Create buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Send email
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: `Attendance Report - ${className} - ${subject.name}`,
      text: `Please find attached the attendance report for ${className} - ${subject.name}.\n\nLegend:\n1 = Present\n0 = Absent\n- = No record`,
      attachments: [{
        filename: `attendance_${className}_${subject.name}_${new Date().toISOString().split('T')[0]}.xlsx`,
        content: buffer
      }]
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');

    res.json({ 
      message: 'Excel file has been sent to your email successfully',
      debug: {
        studentCount: students.length,
        dateCount: dates.length,
        attendanceRecordCount: attendanceRecords.length
      }
    });

  } catch (error) {
    console.error('Error in exportExcelAttendance:', error);
    res.status(500).json({ 
      error: 'Failed to generate and send Excel file', 
      details: error.message 
    });
  }

};
