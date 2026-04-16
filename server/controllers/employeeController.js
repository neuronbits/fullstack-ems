// Get Employees
// GET /api/employees

import Employee from "../models/Employee.js";
import bcrypt from "bcrypt";
import User from "../models/User.js";

export const getEmployees = async (req, res) => {
    try {
        const { department } = req.query;
        const where = {};
        if (department) where.department = department;
        // const employees = await Employee.find(where ).sort({ createdAt: -1 }).populate("userId", "email role").lean();
        const employees = await Employee.find(where).sort({ createdAt: -1 }).populate("userId", "email role").lean();
        console.log(employees);
        const result = employees.map((emp) => ({
            ...emp,
            id: emp._id.toString(),
            user: emp.userId ? { email: emp.userId.email, role: emp.userId.role } : null
        }));
        console.log(result);
        return res.json(result);
        // res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch employees " });
        // res.status(500).json({ success: false, message: error.message });
    }
}

// Create Employee
// POST /api/employees

export const createEmployee = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, position, department, basicSalary, allowances, deductions, joinDate, password, role, bio } = req.body;
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashed, role: role || "EMPLOYEE" });
        const employee = await Employee.create({
            userId: user._id, firstName, lastName, email, phone, position,
            department: department || "Engineering",
            basicSalary: Number(basicSalary) || 0,
            allowances: Number(allowances) || 0,
            deductions: Number(deductions) || 0,
            joinDate: new Date(joinDate),
            bio: bio || "",
        });
        res.status(201).json({ success: true, employee });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "Employee already exists" });
        }
        console.error("Create employee error:", error);
        // res.status(500).json({ success: false, message: error.message });
        return res.status(500).json({ error: "Failed to create employee" });
    }
}

// Update Employee
// PUT /api/employees/:id

export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, phone, position, department, basicSalary, allowances, deductions, password, role, bio, employmentStatus } = req.body;

        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        await Employee.findByIdAndUpdate(id, {
            firstName, lastName, email, phone, position,
            department: department || "Engineering", basicSalary: Number(basicSalary) || 0,
            allowances: Number(allowances) || 0,
            deductions: Number(deductions) || 0,
            employmentStatus: employmentStatus || "Active",
            bio: bio || "",
        });

        // Update user record
        const userUpdate = { email }
        if (role) userUpdate.role = role;
        if (password) userUpdate.password = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(employee.userId, userUpdate);

        res.json({ success: true });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "Employee already exists" });
        }
        return res.status(500).json({ error: "Failed to update employee" });
    }
    // try {
    //     const { id } = req.params;
    //     const employee = await Employee.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    //     if (!employee) {
    //         return res.status(404).json({ success: false, message: "Employee not found" });
    //     }
    //     res.status(200).json({ success: true, data: employee });
    // } catch (error) {
    //     res.status(500).json({ success: false, message: error.message });
    // }

}

// Delete Employee
// DELETE /api/employees/:id

export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }
        employee.isDeleted = true;
        employee.employmentStatus = "INACTIVE";
        await employee.save();

        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: "Failed to delete employee" });
    }
}