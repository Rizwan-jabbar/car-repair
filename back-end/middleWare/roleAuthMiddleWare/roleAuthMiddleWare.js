
import jwt from 'jsonwebtoken';


/** * Role-based auth:
 * - Requires Authorization: Bearer <token>
 * - Verifies token and checks if user has required role(s)
 * - If valid -> sets req.user and continues
    * - If missing/invalid -> 401 Unauthorized
    * - If valid but insufficient role -> 403 Forbidden
    * Usage: roleAuthMiddleWare(['admin', 'editor']) to allow only admin and editor roles
    * Note: req.user will contain the decoded token payload, which should include the user's role(s) */
const roleAuthMiddleWare = (allowedRoles = []) => {
    return (req, res, next) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            const normalizedUserRoles = new Set();

            if (Array.isArray(decoded.roles)) {
                decoded.roles
                    .filter(Boolean)
                    .forEach((role) => normalizedUserRoles.add(String(role).toLowerCase()));
            }

            if (decoded.role) {
                normalizedUserRoles.add(String(decoded.role).toLowerCase());
            }

            // Keep backward compatibility for projects that used "user" vs "customer" interchangeably.
            if (normalizedUserRoles.has('customer')) {
                normalizedUserRoles.add('user');
            }

            if (normalizedUserRoles.has('user')) {
                normalizedUserRoles.add('customer');
            }

            const normalizedAllowedRoles = allowedRoles.map((role) => String(role).toLowerCase());
            const hasRole = normalizedAllowedRoles.length === 0
                ? true
                : normalizedAllowedRoles.some((role) => normalizedUserRoles.has(role));

            if (!hasRole) {
                return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
            }
            return next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
};

export default roleAuthMiddleWare;