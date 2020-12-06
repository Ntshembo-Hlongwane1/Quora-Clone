import express from "express";
import questionsController from "../../Controller/Questions/QuestionController";

const router = express.Router();
const QuestionController = new questionsController();

router.post("/api/ask-question", (request, response) => {
  QuestionController.AskQuestion(request, response);
});

router.get("/api/all-questions", (request, response) => {
  QuestionController.GetAllQuestions(request, response);
});

router.post("/api/likes", (request, response) => {
  QuestionController.Like(request, response);
});
router.post("/api/dislike", (request, response) => {
  QuestionController.Dislike(request, response);
});
export default router;
