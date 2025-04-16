import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const questionsRouter = Router();

// API Endpoint /questions - Create a new question
questionsRouter.post("/", async (req, res) => {
  try {
    // Check if all required fields are present
    if (!req.body.title || !req.body.description || !req.body.category) {
      return res.status(400).json({ message: "Invalid request data." });
    }

    // Destructure the request body
    const { title, description, category } = req.body;

    // Insert the question into the database
    const data = await connectionPool.query(
      "INSERT INTO questions (title, description, category) VALUES ($1, $2, $3) RETURNING *",
      [title, description, category]
    );
    return res.status(201).json(data.rows[0]);
  } catch (error) {
    // Handle errors
    return res.status(500).json({ message: "Unable to create question." });
  }
});

// API Endpoint /questions - Get all questions
questionsRouter.get("/", async (req, res) => {
  try {
    // Fetch all questions
    const data = await connectionPool.query("SELECT * FROM questions");
    return res.status(200).json(data.rows);
  } catch (error) {
    // Handle errors
    return res.status(500).json({ message: "Unable to fetch questions." });
  }
});

export default questionsRouter;