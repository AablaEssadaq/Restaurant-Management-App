export const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.role) return res.status(401).json({ msg: "Unauthorized" }); // Unauthorized

        // Check if the user's role is in the allowed roles
        if (!allowedRoles.includes(req.role)) {
            return res.status(403).json({ msg: "Access denied" }); // Forbidden
        }

        next();
    };
};

export default verifyRoles;
