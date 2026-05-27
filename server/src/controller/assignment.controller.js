import Assignment from "../model/assignment.model.js";
import { generateQuestionsWithAI } from "../services/ai.services.js";
import { uploadToCloudinary } from "../utils/cloudinary.utils.js";
import { extractPdfText } from "../utils/extractedPdfText.js";



// CREATE ASSIGNMENT
export const createAssignment = async (req, res) => {
  try {

    const {
      title,
      subject,
      description,
      questionConfig,
      dueDate
    } = req.body;

    // 1. Validate required fields
    if (!title || !subject || !questionConfig || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "title, subject, and questionConfig are required",
      });
    }

    // 2. Validate PDF file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "PDF file is required",
      });
    }

    // 3. Parse questionConfig
    let parsedQuestionConfig;

    try {

      parsedQuestionConfig = JSON.parse(questionConfig);

    } catch (error) {

      return res.status(400).json({
        success: false,
        message: "questionConfig must be valid JSON",
      });

    }

    // 4. Validate questionConfig
    if (
      !Array.isArray(parsedQuestionConfig) ||
      parsedQuestionConfig.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "questionConfig must be a non-empty array",
      });
    }

    // 5. Validate each question config item
    const isValidConfig = parsedQuestionConfig.every(
      (q) =>
        q.type &&
        typeof q.count === "number" &&
        typeof q.marks === "number"
    );

    if (!isValidConfig) {
      return res.status(400).json({
        success: false,
        message:
          "Each questionConfig item must contain type, count and marks",
      });
    }

    // 6. Extract text from PDF
    const extractedText = await extractPdfText(
      req.file.buffer
    );
    
    // 7. Upload PDF to Cloudinary
    const { secure_url: uploadedPdf } =
      await uploadToCloudinary(req.file.buffer);

    // 8. Create assignment
    const assignment = await Assignment.create({
      title,
      subject,
      description,
      uploadedPdf,
      extractedText,
      questionConfig: parsedQuestionConfig,
      teacherId: req.userId,
      dueDate,
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

export const generateAssessment = async (req, res) => {

  try {

    const { assignmentId } = req.params;

    // 1. Find assignment
    const assignment = await Assignment.findOne({
      _id: assignmentId,
      teacherId: req.userId,
    });

    if (!assignment) {

      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });

    }

    // 2. Prevent duplicate generation
    if (assignment.status === "generating") {

      return res.status(400).json({
        success: false,
        message:
          "Assessment generation already in progress",
      });

    }

    // 3. Prevent regeneration
    if (assignment.status === "completed") {

      return res.status(400).json({
        success: false,
        message:
          "Assessment already generated",
      });

    }

    // 4. Update status
    assignment.status = "generating";

    await assignment.save();

    try {

      // 5. Generate AI Questions
      const generatedQuestions =
        await generateQuestionsWithAI({
          extractedText: assignment.extractedText,
          questionConfig: assignment.questionConfig,
        });

      // 6. Validate AI response
      if (!Array.isArray(generatedQuestions)) {

        assignment.status = "failed";

        assignment.generationError =
          "AI did not return valid array";

        await assignment.save();

        return res.status(500).json({
          success: false,
          message:
            "Invalid AI response format",
        });

      }

      // 7. Save generated questions
      assignment.generatedQuestions =
        generatedQuestions;

      assignment.status = "completed";

      assignment.generationError = "";

      await assignment.save();

      return res.status(200).json({
        success: true,
        message:
          "Assessment generated successfully",
        generatedQuestions,
      });

    } catch (error) {

      assignment.status = "failed";

      assignment.generationError =
        error.message;

      await assignment.save();

      return res.status(500).json({
        success: false,
        message:
          "Failed to generate assessment",
      });

    }

  } catch (error) {

    console.log(
      "generateAssessment error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }

};