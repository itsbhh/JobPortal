import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        // ✅ Check if cookies exist
        if (!req.cookies || !req.cookies.token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }

        // ✅ Get token from cookies
        const token = req.cookies.token;

        try {
            // ✅ Verify JWT Token
            const decode = jwt.verify(token, process.env.SECRET_KEY);
            req.id = decode.userId;
            next();
        } catch (error) {
            return res.status(401).json({
                message: "Invalid or expired token",
                success: false,
            });
        }
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

export default isAuthenticated;
