import {
  googleAuthCallback,
  googleSignAuth,
} from "@/controllers/social.controller";
import express from "express";

const router = express();

router.route("/callback").get(googleAuthCallback);
router.route("/").get(googleSignAuth);

export default router;
