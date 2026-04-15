import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, //unique: true
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    position: { type: String, required: true },
    basicSalary: { type: Number, default: 0 },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    employmentStatus: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    joinDate: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false },
    bio: { type: String, default: "" },

}, { timestamps: true })

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema)

export default Attendance;