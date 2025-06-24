import { Router } from "express";
import { authRateLimiter, forgotPasswordRateLimiter, resendVerificationRateLimiter } from "../middlewares/rateLimit.middleware";
import { upload } from "../middlewares/multer.middleware";
import { forgotPassword, getActiveSessions, googleLogin, logout, logoutAllSessions, logoutSpecificSession, refreshAccessToken, register, resendVerificationEmail, resetPassword, verifyEmail } from "../controllers/auth.controller";
import { isLoggedIn } from "../middlewares/auth.middleware";


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

router.get("/refresh-token", refreshAccessToken);

router.post("/logout", isLoggedIn, logout);
router.post("/logout/all", isLoggedIn, logoutAllSessions);
router.get("/sessions", isLoggedIn, getActiveSessions);
router.post("/sessions/:sessionId", isLoggedIn, logoutSpecificSession);

router.post("/login/google", googleLogin);


export default router 