import { getUserAccountAndProfile } from "@/controllers/users.controller";
import { isAuthenticated, isLoggedIn } from "@/middleware/auth.middleware";
import express from "express";

const router = express();

router.use(isAuthenticated);
router.route("/me").get(isLoggedIn, getUserAccountAndProfile);

export default router;
