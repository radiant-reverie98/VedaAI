import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    uploadedPdf: {
      type: String,
      required: true,
    },

    questionConfig: [
      {
        type: {
          type: String,
          enum: [
            "mcq",
            "short",
            "long",
            "numerical",
            "graph",
          ],
          required: true,
        },

        count: {
          type: Number,
          required: true,
          min: 1,
        },

        marks: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    generatedQuestions: [
      {
        type: {
          type: String,
        },

        question: String,

        options: [String],

        answer: String,

        marks: Number,

        explanation: String,
      },
    ],

    status: {
      type: String,
      enum: ["pending", "generating", "completed", "failed"],
      default: "pending",
    },

    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;