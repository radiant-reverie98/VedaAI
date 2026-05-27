import Assignment from "../model/assignment.model.js";

import { uploadToCloudinary } from "../utils/cloudinary.utils.js";




// CREATE ASSIGNMENT
export const createAssignment = async (req, res) => {
  try {
    const { title, subject, description, questionConfig } = req.body;
    

    // 1. Validate required text fields first (before any I/O)
    if (!title || !subject || !questionConfig) {
      return res.status(400).json({
        success: false,
        message: "title, subject, and questionConfig are required",
      });
    }

    // 2. Validate file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "PDF file is required",
      });
    }

    // 3. Parse and validate questionConfig
    let parsedQuestionConfig;
    try {
      parsedQuestionConfig = JSON.parse(questionConfig);
    } catch {
      return res.status(400).json({
        success: false,
        message: "questionConfig must be valid JSON",
      });
    }

    if (!Array.isArray(parsedQuestionConfig) || parsedQuestionConfig.length === 0) {
      return res.status(400).json({
        success: false,
        message: "questionConfig must be a non-empty array",
      });
    }

    // Optional: validate each item's shape
    const isValidConfig = parsedQuestionConfig.every(
      (q) => q.type && typeof q.count === "number"  // adjust to your schema
    );
    if (!isValidConfig) {
      return res.status(400).json({
        success: false,
        message: "Each questionConfig item must have a valid type and count",
      });
    }

    // 4. Upload to Cloudinary only after all validation passes
    const { secure_url: uploadedPdf } = await uploadToCloudinary(req.file.buffer);

    // 5. Persist
    const assignment = await Assignment.create({
      title,
      subject,
      description,
      uploadedPdf,
      questionConfig: parsedQuestionConfig,
      teacherId: req.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      assignment,
    });

  } catch (error) {
    console.error("createAssignment error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};




// GET ALL ASSIGNMENTS OF LOGGED IN TEACHER
export const getMyAssignments = async (req, res) => {
  try {

    const teacherId = req.userId;

    const assignments = await Assignment.find({
      teacherId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      assignments,
    });

  } catch (error) {

    console.log("Get Assignments Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }
};



// GET SINGLE ASSIGNMENT
export const getSingleAssignment = async (req, res) => {
  try {

    const { assignmentId } = req.params;

    const teacherId = req.userId;

    const assignment = await Assignment.findOne({
      _id: assignmentId,
      teacherId,
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    return res.status(200).json({
      success: true,
      assignment,
    });

  } catch (error) {

    console.log("Get Single Assignment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }
};



// DELETE ASSIGNMENT
export const deleteAssignment = async (req, res) => {
  try {

    const { assignmentId } = req.params;

    const teacherId = req.userId;

    const assignment = await Assignment.findOneAndDelete({
      _id: assignmentId,
      teacherId,
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Assignment deleted successfully",
    });

  } catch (error) {

    console.log("Delete Assignment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }
};