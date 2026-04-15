import { Router } from "express";
import { login, logout, changePassword, session } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.get("/session", protect, session);
authRouter.post("/logout", protect, logout);
authRouter.post("/change-password", protect, changePassword);

export default authRouter;