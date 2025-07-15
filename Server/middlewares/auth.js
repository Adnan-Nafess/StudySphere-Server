import JWT from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

// auth
export const auth = async (req, res, next) => {
    try {
        // extract token
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");

        // if token missing then return response
        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }

        // verify the token
        try {
            const decode = JWT.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }catch (err) {
            // verification = issue
            return res.status(401).json({
                success: false,
                message: 'token is invalid',
            });
        }

        next();
    }catch(err) {
        console.log(err);
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token",
        });
    }
};

// isStudent
export const isStudent = async (req, res, next) => {
    try {
        if(req.user.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is protected route for student only",
            });
        }
        next();
    }catch(err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "User role can not be verify",
        });
    }
};

// isInstructor
export const isInstructor = async (req, res, next) => {
    try {
        if(req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "This is protected route for Instructor only",
            });
        }
        next();
    }catch(err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "User role can not be verify",
        });
    }
};


// isAdmin
export const isAdmin = async (req, res, next) => {
    try {
        if(req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is protected route for Admin only",
            });
        }
        next();
    }catch(err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "User role can not be verify",
        });
    }
};