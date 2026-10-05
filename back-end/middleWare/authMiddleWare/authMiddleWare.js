
import jwt from "jsonwebtoken";

const authMiddleWare = (req, res, next) => {
    const authorization = req.header('Authorization') || '';
    const [scheme, value] = authorization.trim().split(/\s+/);
    const token = scheme?.toLowerCase() === 'bearer' ? value : '';

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

export default authMiddleWare;
