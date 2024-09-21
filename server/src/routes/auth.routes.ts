import { login, signUp } from "@/controllers/auth.controller";
import express from "express";

const router = express();

router.route("/register").post(signUp);
router.route("/login").post(login);

export default router;
