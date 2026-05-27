import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from './src/routes/auth.routes.js'
import assignmentRoutes from './src/routes/assignment.routes.js'
import {model} from "./src/services/ai.services.js"
const app = express();

app.get("/test-ai", async (req, res) => {

  try {

    const result = await model.generateContent(
      "Say hello"
    );

    const response = result.response.text();

    res.json({
      success: true,
      response,
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      error,
    });

  }

});

// Middlewares
app.use(express.json());

app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Working"
  });
});

app.use("/api/auth",authRoutes)
app.use("/api/assignment",assignmentRoutes)


export default app;