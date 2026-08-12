import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import connectDB from "./config/db.js";
import User from "./models/User.js";
import Employee from "./models/Employee.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing sample data
    await User.deleteMany({});
    await Employee.deleteMany({});

    // Create Employees
    const employees = await Employee.insertMany([
      {
        employeeId: "EMP001",
        name: "John Doe",
        email: "john@company.com",
        phone: "9876543210",
        department: "IT",
        designation: "Software Developer",
        status: "Active",
      },
      {
        employeeId: "EMP002",
        name: "Sarah Smith",
        email: "sarah@company.com",
        phone: "9876543211",
        department: "HR",
        designation: "HR Manager",
        status: "Active",
      },
      {
        employeeId: "EMP003",
        name: "David Wilson",
        email: "david@company.com",
        phone: "9876543212",
        department: "Finance",
        designation: "Accountant",
        status: "Active",
      },
      {
        employeeId: "EMP004",
        name: "Emily Johnson",
        email: "emily@company.com",
        phone: "9876543213",
        department: "Marketing",
        designation: "Marketing Executive",
        status: "Active",
      },
    ]);

    const hashedPassword = await bcrypt.hash("123456", 10);

    // Create Users
    await User.create([
      {
        employee: null,
        email: "admin@company.com",
        password: hashedPassword,
        role: "admin",
        isActive: true,
      },
      {
        employee: employees[0]._id,
        email: "john@company.com",
        password: hashedPassword,
        role: "employee",
        isActive: true,
      },
      {
        employee: employees[1]._id,
        email: "sarah@company.com",
        password: hashedPassword,
        role: "employee",
        isActive: true,
      },
      {
        employee: null,
        email: "reception@company.com",
        password: hashedPassword,
        role: "receptionist",
        isActive: true,
      },
    ]);

    console.log("Database seeded successfully");

    console.log("\nLogin Credentials:");
    console.log("-----------------------------");
    console.log("Admin");
    console.log("Email: admin@company.com");
    console.log("Password: 123456");

    console.log("\nReceptionist");
    console.log("Email: reception@company.com");
    console.log("Password: 123456");

    console.log("\nEmployee 1");
    console.log("Email: john@company.com");
    console.log("Password: 123456");

    console.log("\nEmployee 2");
    console.log("Email: sarah@company.com");
    console.log("Password: 123456");
    console.log("-----------------------------");

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();