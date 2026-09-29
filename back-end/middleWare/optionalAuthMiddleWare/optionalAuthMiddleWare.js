import jwt from 'jsonwebtoken';

/**
 * Optional auth:
 * - If Authorization: Bearer <token> is provided and valid -> sets req.user
 * - If missing/invalid -> continues without req.user
 */
const optionalAuthMiddleWare = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (error) {
        req.user = null;
        return next();
    }
};

export default optionalAuthMiddleWare;
