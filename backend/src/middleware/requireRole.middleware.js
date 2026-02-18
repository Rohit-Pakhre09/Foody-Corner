export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized user!" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden! Insufficient role." });
        }

        return next();
    };
};
