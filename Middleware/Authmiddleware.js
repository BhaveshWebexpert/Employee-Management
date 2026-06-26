import jwt from "jsonwebtoken"
import User from "../Models/User.js"
import Token from "../Models/Token.js"
import jwtToken from "../Config/EnvVar.js"

export default async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, jwtToken.jwtToken);
        } catch (err) {
            const message = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
            return res.status(401).json({ success: false, message });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        const tokenDoc = await Token.findOne({ jti: decoded.jti });
        if (!tokenDoc) {
            return res.status(401).json({ success: false, message: 'Token revoked' });
        }

        tokenDoc.lastUsedAt = new Date();
        await tokenDoc.save();

        req.user = user;
        req.tokenDoc = tokenDoc;
        next();
    } catch (e) {
        console.error('Auth Middleware Error: ', e);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};