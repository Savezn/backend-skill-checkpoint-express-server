import express from "express";
import questionsRouter from "./routes/questions.mjs";
import answersRouter from "./routes/answers.mjs";

const app = express();
const port = 4000;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.use("/questions", questionsRouter);
app.use("/answers", answersRouter);

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
