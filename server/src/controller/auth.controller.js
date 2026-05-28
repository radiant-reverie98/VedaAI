import User from "../model/user.model.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const registerUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            schoolName
        } = req.body;


        // Validation
        if (!name || !email || !password || !schoolName) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }


        // Check Existing User
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }


        // Password Validation
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be atleast 8 characters long"
            });
        }


        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);


        // Create User
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            schoolName,
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
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });


        // Response
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                schoolName: user.schoolName,
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
        console.log(req.body)

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
        console.log(`Password match`,isPasswordMatched)
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

export const logoutUser = async (req, res) => {

    try {

        res.cookie("token", "", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            expires: new Date(0),
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};


export const getCurrentUser =
  async (req, res) => {

  try {

    const user =
      await User.findById(
        req.userId
      ).select("-password");

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    console.log(
      "Get Current User Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Internal server error",
    });

  }

};