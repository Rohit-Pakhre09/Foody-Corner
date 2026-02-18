import jwt from "jsonwebtoken";
import User from "../models/User.model.js"

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken;
        if (!token) {
            return res.status(401).json("Token is not provided!");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);
        if (!decodedToken) {
            return res.status(401).json("Unauthorized token!");
        }

        const user = await User.findById(decodedToken?._id);
        if (!user) {
            return res.status(404).json("User not found!");
        }

        req.user = user;
        return next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized user!" });
    }
}
