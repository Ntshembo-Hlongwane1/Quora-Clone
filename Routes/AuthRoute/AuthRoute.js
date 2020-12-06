import express from "express";
import authController from "../../Controller/Auth/AuthController";

const router = express.Router();
const AuthController = new authController();

router.post("/api/user-signup", (request, response) => {
  AuthController.SignUp(request, response);
});

router.post("/api/user-signin", (request, response) => {
  AuthController.Login(request, response);
});

router.get("/api/isUserLoggedIn", (request, response) => {
  AuthController.isLoggedIn(request, response);
});

export default router;
