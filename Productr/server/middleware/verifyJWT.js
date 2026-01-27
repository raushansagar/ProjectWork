import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from '../models/user.models.js'
import jwt from "jsonwebtoken";


// verify login user 
const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        let token = null;

        if (req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        } else if (req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        // check token 
        if (!token || token == null) {
            throw new ApiError(401, "Unauthorized: No access token provided");
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // find user
        const user = await User.findById(decoded.id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Unauthorized request: User not found");
        }

        req.user = user;
        next();
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(new ApiError(401, "Access token expired"));
        } else if (error.name === "JsonWebTokenError") {
            return next(new ApiError(401, "Invalid access token"));
        } else {
            return next(new ApiError(401, error.message || "Unauthorized request"));
        }
    }
})


export default verifyJWT;