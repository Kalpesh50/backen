require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data


  // Seed subjects with types
  const students = [
   
    { rollNo: 11, name: 'Kunal Malhotra', class: 'TY' },
    { rollNo: 12, name: 'Priya Iyer', class: 'TY' },
    { rollNo: 13, name: 'Arjun Joshi', class: 'TY' },
    { rollNo: 14, name: 'Sneha Desai', class: 'TY' },
    { rollNo: 15, name: 'Riya Kapoor', class: 'TY' },
    { rollNo: 16, name: 'Aditya Mehta', class: 'TY' },
    { rollNo: 17, name: 'Neha Choudhary', class: 'TY' },
    { rollNo: 18, name: 'Varun Saxena', class: 'TY' },
    { rollNo: 19, name: 'Simran Kaur', class: 'TY' },
    { rollNo: 20, name: 'Harsh Vyas', class: 'TY' },
    { rollNo: 21, name: 'Aditi Reddy', class: 'TY' },
    { rollNo: 22, name: 'Dhruv Jain', class: 'TY' },
    { rollNo: 23, name: 'Kriti Bhatt', class: 'TY' },
    { rollNo: 24, name: 'Nisha Agarwal', class: 'TY' },
    { rollNo: 25, name: 'Manish Ghosh', class: 'TY' },
    { rollNo: 26, name: 'Sanya Pandey', class: 'TY' },
    { rollNo: 27, name: 'Rahul Das', class: 'TY' },
    { rollNo: 28, name: 'Tanya Paul', class: 'TY' },
    { rollNo: 29, name: 'Yash Saxena', class: 'TY' },
    { rollNo: 30, name: 'Alok Dubey', class: 'TY' },
    { rollNo: 31, name: 'Anjali Shetty', class: 'TY' },
    { rollNo: 32, name: 'Raghav Bhat', class: 'TY' },
    { rollNo: 33, name: 'Aakash Roy', class: 'TY' },
    { rollNo: 34, name: 'Sakshi Jain', class: 'TY' },
    { rollNo: 35, name: 'Vivek Tiwari', class: 'TY' },
    { rollNo: 36, name: 'Shruti Kulkarni', class: 'TY' },
    { rollNo: 37, name: 'Kiran Pillai', class: 'TY' },
    { rollNo: 38, name: 'Pooja Chawla', class: 'TY' },
    { rollNo: 39, name: 'Nitin Rao', class: 'TY' },
    { rollNo: 40, name: 'Arti Yadav', class: 'TY' },
    { rollNo: 41, name: 'Saurabh Joshi', class: 'TY' },
    { rollNo: 42, name: 'Avni Menon', class: 'TY' },
    { rollNo: 43, name: 'Ritika Srivastava', class: 'TY' },
    { rollNo: 44, name: 'Ajay Chaudhary', class: 'TY' },
    { rollNo: 45, name: 'Siddharth Singh', class: 'TY' },
    { rollNo: 46, name: 'Poonam Mishra', class: 'TY' },
    { rollNo: 47, name: 'Nikhil Kapoor', class: 'TY' },
    { rollNo: 48, name: 'Tanvi Gupta', class: 'TY' },
    { rollNo: 49, name: 'Shreya Sinha', class: 'TY' },
    { rollNo: 50, name: 'Gaurav Arora', class: 'TY' },
    { rollNo: 51, name: 'Kavya Deshmukh', class: 'TY' },
    { rollNo: 52, name: 'Pranav Naik', class: 'TY' },
    { rollNo: 53, name: 'Shivani Reddy', class: 'TY' },
    { rollNo: 54, name: 'Lakshya Bose', class: 'TY' },
    { rollNo: 55, name: 'Aman Sehgal', class: 'TY' },
    { rollNo: 56, name: 'Isha Malhotra', class: 'TY' },
    { rollNo: 57, name: 'Tushar Singh', class: 'TY' },
    { rollNo: 58, name: 'Pooja Vaidya', class: 'TY' },
    { rollNo: 59, name: 'Riya Prasad', class: 'TY' },
    { rollNo: 60, name: 'Sanjay Kaushik', class: 'TY' },
    { rollNo: 61, name: 'Mitali Anand', class: 'TY' },
    { rollNo: 62, name: 'Rajesh Khanna', class: 'TY' },
    { rollNo: 63, name: 'Rohit Sharma', class: 'TY' },
    { rollNo: 64, name: 'Aarti Singh', class: 'TY' },
    { rollNo: 65, name: 'Nisha Kapoor', class: 'TY' },
    { rollNo: 66, name: 'Abhishek Yadav', class: 'TY' },
    { rollNo: 67, name: 'Divya Bhatt', class: 'TY' },
    { rollNo: 68, name: 'Vikram Iyer', class: 'TY' },
    { rollNo: 69, name: 'Suman Verma', class: 'TY' }
  ];
  

  for (const student of students) {
    await prisma.student.create({
      data: student
    });
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 