import { getUserAccountAndProfile } from "@/controllers/users.controller";
import { isAuthenticated } from "@/middleware/auth.middleware";
import express from "express";

const router = express();

router.all("*", isAuthenticated);
router.route("/me").get(getUserAccountAndProfile);

export default router;
