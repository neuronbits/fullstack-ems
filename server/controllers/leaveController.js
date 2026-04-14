
// Create Leave
// POST /api/leaves

const { stat } = require("node:fs");
const { default: Employee } = require("../models/Employee.js");
const { default: LeaveApplication } = require("../models/LeaveApplication.js");

const createLeave = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({ userId: session.userId });
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        if (employee.isDeleted) {
            return res.status(403).json({ message: "Your account is deactivated. You cannot clock in/out." });
        }

        const { type, startDate, endDate, reason } = req.body;
        if (!type || !startDate || !endDate || !reason) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (new Date(startDate) >= today || new Date(endDate) <= today) {
            return res.status(400).json({ message: "Leave dates must be in the future" });
        }
        if (new Date(endDate) > new Date(startDate)) {
            return res.status(400).json({ message: "End date cannot be before start date" });
        }

        const leave = await LeaveApplication.create({
            employeeId: employee._id,
            type,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason,
            status: "PENDING"
        });
        return res.json({ success: true, data: leave });
    } catch (error) {
        return res.status(500).json({ error: "Failed to create leave" });
    }
}


// Get Leaves
// GET /api/leaves

const getLeaves = async (req, res) => {
    try {
        const session = req.session;
        const isAdmin = session.role === "ADMIN";
        if (isAdmin) {
            const status = req.query.status;
            const where = status ? { status } : {};
            const leaves = await LeaveApplication.find(where).populate("employeeId").sort({ createdAt: -1 });
            const data = leaves.map((l) => {
                const obj = l.toObject();
                return {
                    ...obj,
                    id: obj._id.toString(),
                    employee: obj.employeeId,
                    employeeId: obj.employeeId?._id?.toString(),
                }
            });
            return res.json({ data });
        } else {
            const employee = await Employee.findOne({ userId: session.userId }).lean();
            if (!employee) {
                return res.status(404).json({ message: "Not found" });
            }
            const leaves = await LeaveApplication.find({ employeeId: employee._id }).sort({ createdAt: -1 });
            return res.json({ data: leaves, employee: { ...employee, id: employee._id.toString() } });
        }
    } catch (error) {
        return res.status(500).json({ error: "Failed to create leave" });
    }
}

// Update leave status
// PUT /api/leaves/:id

const updateLeaveStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        const leave = await LeaveApplication.findByIdAndUpdate(req.params.id, { status }, { returnDocument: "after" });
        // if (!leave) {
        //     return res.status(404).json({ message: "Leave not found" });
        // }
        return res.json({ success: true, data: leave });
    } catch (error) {
        return res.status(500).json({ error: "Failed" });
    }
}

