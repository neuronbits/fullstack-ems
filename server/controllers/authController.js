
// Login for employee and Admin
// POST /api/auth/login

import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    try {
        const { email, password, role_type } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        if (role_type === 'admin' && user.role !== 'ADMIN') {
            return res.status(401).json({ error: "Not authorized as admin" });
        }

        if (role_type === 'employee' && user.role !== 'EMPLOYEE') {
            return res.status(401).json({ error: "Not authorized as employee" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const payload = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
        // res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "strict",
        //     maxAge: 60 * 60 * 1000,
        // });
        return res.json({ user: payload, token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Login failed" });
    }
}

// get session for employee and Admin
// /api/auth/session

export const session = async (req, res) => {
    try {
        const session = req.session;
        if (!session) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        return res.json({ user: session });
        // const token = req.cookies.token;
        // if (!token) {
        //     return res.status(401).json({ error: "Unauthorized" });
        // }
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // return res.json({ user: decoded });
    } catch (error) {
        console.error("Get session error:", error);
        res.status(500).json({ error: "Get session failed" });
    }
}

// Change password for employee and admin
// POST /api/auth/change-password

export const changePassword = async (req, res) => {
    try {
        const session = req.session;
        if (!session) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Current password and new password are required" });
        }

        const user = await User.findById(session.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return res.status(400).json({ error: "Current password is incorrect" });
        }
        const hashed = await bcrypt.hash(newPassword, 10);
        await user.findByIdAndUpdate(session.userId, { password: hashed });

        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: "Failed to change password" });
    }
}

// Logout for employee and admin
// POST /api/auth/logout

export const logout = async (req, res) => {
    try {
        const session = req.session;
        if (!session) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: "Failed to logout" });
            }
            return res.json({ success: true });
        });
    } catch (error) {
        return res.status(500).json({ error: "Failed to logout" });
    }
}