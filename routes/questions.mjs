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
    return res
      .status(201)
      .json({ message: "Question created successfully.", data: data.rows[0] });
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

// API Endpoint /questions/search - Search questions by title or category
questionsRouter.get("/search", async (req, res) => {
  console.log("Search endpoint hit");
  console.log(req.query); // Log the query parameters for debugging

  try {
    // Get the search query from the request
    const { title, category } = req.query;
    console.log("title:", title, "category:", category);

    // Check if the search query is present
    if (!title && !category) {
      return res.status(400).json({ message: "Invalid search parameters." });
    }
    // Fetch questions based on the search query
    const data = await connectionPool.query(
      "SELECT * FROM questions WHERE (title ILIKE $1 OR $1 IS NULL OR $1 = '') AND (category ILIKE $2 OR $2 IS NULL OR $2 = '')",
      [`%${title}%`, `%${category}%`]
    );
    // Check if any questions were found
    if (data.rows.length === 0) {
      return res.status(404).json({ message: "No questions found." });
    }

    // Return the found questions
    return res.status(200).json({ data: data.rows });
  } catch (error) {
    // Handle errors
    console.error(error);
    return res.status(500).json({ message: "Unable to fetch a question." });
  }
});

// API Endpoint /questions/:questionId - Get a question by ID
questionsRouter.get("/:questionId", async (req, res) => {
  try {
    // Fetch the question by ID
    const questionId = req.params.questionId;
    const data = await connectionPool.query(
      "SELECT * FROM questions WHERE id = $1",
      [questionId]
    );

    // Check if the question exists
    if (data.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    return res.status(200).json(data.rows[0]);

    // Handle errors
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch question." });
  }
});

// API Endpoint /questions/:questionId - Update a question by ID
questionsRouter.put("/:questionId", async (req, res) => {
  try {
    // Check if all required fields are present
    if (!req.body.title || !req.body.description || !req.body.category) {
      return res.status(400).json({ message: "Invalid request data." });
    }

    // Destructure the request body
    const { title, description, category } = req.body;

    // Update the question in the database
    const questionId = req.params.questionId;
    const data = await connectionPool.query(
      "UPDATE questions SET title = $1, description = $2, category = $3 WHERE id = $4 RETURNING *",
      [title, description, category, questionId]
    );

    // Check if the question exists
    if (data.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    // Return the updated question
    return res.status(200).json({
      message: "Question updated successfully.",
      data: data.rows[0],
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({ message: "Unable to fetch question." });
  }
});

// API Endpoint /questions/:questionId - Delete a question by ID
questionsRouter.delete("/:questionId", async (req, res) => {
  try {
    // Fetch the question by ID
    const questionId = req.params.questionId;
    const data = await connectionPool.query(
      "DELETE FROM questions WHERE id = $1 RETURNING *",
      [questionId]
    );

    // Check if the question exists
    if (data.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    // Return a success message
    return res.status(200).json({ message: "Question deleted successfully." });
  } catch (error) {
    // Handle errors
    return res.status(500).json({ message: "Unable to delete question." });
  }
});

// API Endpoint /questions/:questionId/answers - Create an answer for a question
questionsRouter.post("/:questionId/answers", async (req, res) => {
  try {
    // Check if all required fields are present
    if (!req.body.content) {
      return res.status(400).json({ message: "Invalid request data." });
    }

    // Destructure the request body
    const { content } = req.body;
    const questionId = req.params.questionId;

    // Check if the question exists
    const questionData = await connectionPool.query(
      "SELECT * FROM questions WHERE id = $1",
      [questionId]
    );
    if (questionData.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    // Insert the content into the database
    const data = await connectionPool.query(
      "INSERT INTO answers (question_id, content) VALUES ($1, $2) RETURNING *",
      [questionId, content]
    );

    return res
      .status(201)
      .json({ message: "Answer created successfully.", data: data.rows[0] });
  } catch (error) {
    // Handle errors
    return res.status(500).json({ message: "Unable to create answer." });
  }
});

// API Endpoint /questions/:questionId/answers - Get answers for a question
questionsRouter.get("/:questionId/answers", async (req, res) => {
  try {
    // Fetch answers for the question by ID
    const questionId = req.params.questionId;
    const data = await connectionPool.query(
      "SELECT * FROM answers WHERE question_id = $1",
      [questionId]
    );

    // Check if the question exists
    if (data.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    // Return the answers for the question
    return res.status(200).json(data.rows);
  } catch (error) {
    // Handle errors
    return res.status(500).json({ message: "Unable to fetch answers." });
  }
});

export default questionsRouter;
