import {
  getUserAccountAndProfile,
  getUserByID,
} from "@/controllers/users.controller";
import { isAuthenticated, isLoggedIn } from "@/middleware/auth.middleware";
import express from "express";

const router = express();

router.use(isAuthenticated);
router.route("/me").get(getUserAccountAndProfile);
router.route("/:id").get(isLoggedIn, getUserByID);

export default router;
