import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const answersRouter = Router();

// API Endpoint /answers/answerId/vote - Vote on an answer
answersRouter.post("/:answerId/vote", async (req, res) => {
  try {
    // Check if all required fields are present
    if (!req.body.vote) {
      return res.status(400).json({ message: "Invalid vote value." });
    }

    // Destructure the answerId from the request parameters
    const { vote } = req.body;
    const answerId = req.params.answerId;

    // Check if the answer exists
    const answerData = await connectionPool.query(
      "SELECT * FROM answer_votes WHERE answer_id = $1",
      [answerId]
    );
    if (answerData.rows.length === 0) {
      return res.status(404).json({ message: "Answer not found." });
    }

    // Update the vote count in the database
    const data = await connectionPool.query(
      "UPDATE answer_votes SET vote = $1 WHERE answer_id = $2 RETURNING *",
      [vote, answerId]
    );

    // Return a success message
    return res.status(200).json({ message: "Vote on the answer has been recorded successfully.", data: data.rows[0] });
  } catch (error) {
    // Handle errors
    return res.status(500).json({ message: "Unable to vote answer." });
  }
});

export default answersRouter;