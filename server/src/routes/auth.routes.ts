import { login, refreshTokens, signUp } from "@/controllers/auth.controller";
import express from "express";

const router = express();

router.route("/register").post(signUp);
router.route("/login").post(login);
router.route("/refresh").get(refreshTokens);

export default router;
