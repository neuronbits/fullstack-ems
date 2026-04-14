
// get Profile
// GET /api/profile

import Employee from "../models/Employee.js";

export const getProfile = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({ userId: session.userId });
        if (!employee) {
            // Authenticated user is not an employee = return admin profile
            return res.json({
                firstName: "Admin",
                lastName: "",
                email: session.email
            });
        }
        return res.json(employee);

        // const user = await User.findById(req.user.id).select("-password");
        // res.json(user);
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch profile" });
    }
}

// Update profile
// PUT /api/profile

export const updateProfile = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({ userId: session.userId });
        if (!employee) return res.status(404).json({ error: "Employee not found" });
        if (employee.isDeleted) return res.status(403).json({ error: "Your account is deactivated. You cannot update your profile." });
        await Employee.findByIdAndUpdate(employee._id, { bio: req.body.bio });
        return res.json({ success: true });

        // const { name, email, password } = req.body;

        // const user = await User.findById(req.user.id);

        // if (!user) {
        //     return res.status(404).json({ message: "User not found" });
        // }

        // user.name = name || user.name;
        // user.email = email || user.email;
        // user.password = password || user.password;

        // await user.save();
        // res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to update profile" });
    }
}