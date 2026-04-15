import { Router } from "express";
import { getAttendance, clockInOut } from "../controllers/attendanceController.js";
import { protect } from "../middleware/auth.js";

const attendanceRouter = Router();

attendanceRouter.post("/", protect, clockInOut);
attendanceRouter.get("/", protect, getAttendance);

export default attendanceRouter;