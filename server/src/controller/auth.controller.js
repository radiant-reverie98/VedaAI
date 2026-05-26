import User from "../model/user.model.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;


        // Check Existing User
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        if(password.length < 8){
            return res.status(400).json({
                success: false,
                message: "Password must be atleast 8 characters long"
            })
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);


        // Create User
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });


        // Generate JWT Token
        const token = jwt.sign(
            {
                userId: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );


        // Set Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });


        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

export const loginUser = async (req, res) => {

    try {

        // Request Body
        const { email, password } = req.body;


        // Check User
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }


        // Compare Password
        const isPasswordMatched = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordMatched) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }


        // Generate JWT Token
        const token = jwt.sign(
            {
                userId: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );


        // Set Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });


        // Response
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};