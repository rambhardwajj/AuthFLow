import { Router } from "express";
import { authRateLimiter, forgotPasswordRateLimiter, resendVerificationRateLimiter } from "../middlewares/rateLimit.middleware";
import { upload } from "../middlewares/multer.middleware";
import { forgotPassword, register, resendVerificationEmail, resetPassword, verifyEmail } from "../controllers/auth.controller";


const router = Router();

router.post(
  "/register",
  authRateLimiter,
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  register,
);

router.get("/verify/:token", verifyEmail);
router.post("/email/resend", resendVerificationRateLimiter, resendVerificationEmail);
router.post("/password/forgot", forgotPasswordRateLimiter, forgotPassword);
router.post("/password/reset/:token", resetPassword);

export default router 