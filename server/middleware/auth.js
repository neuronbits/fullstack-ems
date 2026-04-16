import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "protect authHeader Unauthorized" });
        }
        const token = authHeader.split(" ")[1];
        const session = jwt.verify(token, process.env.JWT_SECRET);
        if (!session) {
            return res.status(401).json({ error: "protect session Unauthorized" });
        }
        req.session = session;
        next();
    } catch (error) {
        return res.status(401).json({ error: "protect catch block middlware Unauthorized" });
    }
}

export const protectAdmin = (req, res, next) => {
    // if (!req.session.user) {
    //     return res.status(401).json({ error: "protectAdmin session Unauthorized" });
    // }
    if (req?.session?.role !== "ADMIN") {
        return res.status(403).json({ error: "Admin access required" });
    }
    next();
}