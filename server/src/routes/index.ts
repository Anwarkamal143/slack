import express from "express";
import authRoutes from "./auth.routes";
import googleRoutes from "./google.routes";
import usersRoutes from "./users.routes";

const router = express.Router();

router.use("/users", usersRoutes);
router.use("/auth", authRoutes);
router.use("/google", googleRoutes);
export default router;
