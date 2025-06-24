import ms, { StringValue } from "ms";
import { uploadOnCloudinary } from "../configs/coudinary";
import { prisma } from "../configs/db";
import { env } from "../configs/env";
import { logger } from "../configs/logger";
import { ApiResponse } from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { CustomError } from "../utils/CustomError";
import { handleZodError } from "../utils/handleZodError";
import { createHash, generateAccessToken, generateRefreshToken, generateToken, hashPassword, passwordMatch } from "../utils/helper";
import { sanitizeUser } from "../utils/sanitizeUser";
import { sendResetPasswordMail, sendVerificationMail } from "../utils/sendMail";
import { validateEmail, validateLogin, validateRegister, validateResetPassword } from "../validations/auth.validation";
import { generateCookieOptions } from "../configs/cookies";


export const register = asyncHandler(async (req, res) => {
  const { email, password, fullname } = handleZodError(validateRegister(req.body));

  logger.info("Registration attempt", { email, ip: req.ip });

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new CustomError(409, "Email is already registered");
  }

  const hashedPassword = await hashPassword(password);
  const { unHashedToken, hashedToken, tokenExpiry } = generateToken();

  let avatarUrl;
  if (req.file) {
    try {
      const uploaded = await uploadOnCloudinary(req.file.path);
      avatarUrl = uploaded?.secure_url;
      logger.info("Avatar uploaded successfully", { email, avatarUrl });
    } catch (err: any) {
      logger.warn(`Avatar upload failed for ${email} due to ${err.message}`);
    }
  }

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      fullname,
      avatar: avatarUrl,
      verificationToken: hashedToken,
      verificationTokenExpiry: tokenExpiry,
    },
  });

  await sendVerificationMail(user.fullname, user.email, unHashedToken);

  logger.info("Verification email sent", { email, userId: user.id, ip: req.ip });

  logger.info("User registered successfully", {
    email,
    userId: user.id,
    ip: req.ip,
  });

  const safeUser = sanitizeUser(user);

  res
    .status(200)
    .json(new ApiResponse(200, "Registered Successfully. Please verify your email.", safeUser));
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) throw new CustomError(400, "Verification token is required");

  const hashedToken = createHash(token);

  const user = await prisma.user.findFirst({
    where: {
      verificationToken: hashedToken,
      verificationTokenExpiry: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new CustomError(410, "The verification link is invalid or has expired");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const hashedRefreshToken = createHash(refreshToken);

  const expiresAt = new Date(Date.now() + ms(env.REFRESH_TOKEN_EXPIRY as StringValue));

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
    },
  });

  const kk = await prisma.session.create({
    data: {
      userId: user.id,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
      refreshToken: hashedRefreshToken,
      expiresAt,
    },
  });

  logger.info("Email verified successfully", {
    email: user.email,
    userId: user.id,
    ip: req.ip,
  });

  res
    .status(200)
    .cookie("accessToken", accessToken, generateCookieOptions())
    .cookie("refreshToken", refreshToken, generateCookieOptions())
    .json(new ApiResponse(200, "Email verified successfully", null));
});

export const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = handleZodError(validateEmail(req.body));

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new CustomError(401, "No account found with this email address");
  }

  if (user.isVerified) {
    throw new CustomError(400, "Email is already verified");
  }

  const { unHashedToken, hashedToken, tokenExpiry } = generateToken();

  await prisma.user.update({
    where: { email },
    data: {
      verificationToken: hashedToken,
      verificationTokenExpiry: tokenExpiry,
    },
  });

  await sendVerificationMail(user.fullname, user.email, unHashedToken);

  logger.info(`Verification email resent`, {
    email,
    userId: user.id,
    ip: req.ip,
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, "Verification mail sent successfully. Please check your inbox", null),
    );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = handleZodError(validateLogin(req.body));

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new CustomError(401, "Invalid credentials");
  }

  const isPasswordCorrect = await passwordMatch(password, user.password as string);

  if (!isPasswordCorrect) {
    throw new CustomError(401, "Invalid credentials");
  }

  if (!user.isVerified) {
    throw new CustomError(401, "Please verify your email first");
  }

  const userAgent = req.headers["user-agent"];
  const ipAddress = req.ip;

  const existingSession = await prisma.session.findFirst({
    where: {
      userId: user.id,
      userAgent,
      ipAddress,
    },
  });

  const existingSessionsCount = await prisma.session.count({
    where: { userId: user.id },
  });

  if (!existingSession && existingSessionsCount >= env.MAX_SESSIONS) {
    throw new CustomError(
      429,
      "Maximum session limit reached. Please logout from another device first.",
    );
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const hashedRefreshToken = createHash(refreshToken);

  const expiresAt = new Date(Date.now() + ms(env.REFRESH_TOKEN_EXPIRY as StringValue));

  if (existingSession) {
    await prisma.session.update({
      where: { id: existingSession.id },
      data: {
        refreshToken: hashedRefreshToken,
        expiresAt,
      },
    });
  } else {
    await prisma.session.create({
      data: {
        userId: user.id,
        userAgent,
        ipAddress,
        refreshToken: hashedRefreshToken,
        expiresAt,
      },
    });
  }

  logger.info("User logged in", { email: user.email, userId: user.id, ip: req.ip });

  res
    .status(200)
    .cookie("accessToken", accessToken, generateCookieOptions())
    .cookie("refreshToken", refreshToken, generateCookieOptions({ rememberMe }))
    .json(new ApiResponse(200, "Logged in successfully", null));
});

export const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  const { id, email } = req.user;

  if (!refreshToken) {
    throw new CustomError(400, "Refresh token is missing.");
  }

  const hashedRefreshToken = createHash(refreshToken);

  try {
    await prisma.session.delete({
      where: { refreshToken: hashedRefreshToken },
    });
  } catch (error: any) {
    // Confussion ++
    // throw new CustomError(400, "Invalid or expired session. Please log in again.");
    res
      .status(200)
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .json(new ApiResponse(200, "Logged out successfully", null));
  }

  logger.info("User logged out", { email, userId: id, ip: req.ip });

  res
    .status(200)
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .json(new ApiResponse(200, "Logged out successfully", null));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = handleZodError(validateEmail(req.body));

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, "If an account exists, a reset link has been sent to the email", null),
      );
  }

  if (user.provider !== "local") {
    return res.status(200).json(
      new ApiResponse(
        200,
        "You signed up using Google. Please use Google Sign-In to access your account.",
        {
          code: "OAUTH_USER",
        },
      ),
    );
  }

  const { unHashedToken, hashedToken, tokenExpiry } = generateToken();

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: tokenExpiry,
    },
  });

  await sendResetPasswordMail(user.fullname, user.email, unHashedToken);

  logger.info("Password reset email sent", { email: user.email, userId: user.id, ip: req.ip });

  res
    .status(200)
    .json(
      new ApiResponse(200, "If an account exists, a reset link has been sent to the email", null),
    );
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = handleZodError(validateResetPassword(req.body));

  if (!token) {
    throw new CustomError(400, "Password reset token is missing");
  }

  const hashedToken = createHash(token);

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    throw new CustomError(410, "Reset link has expired or is invalid.");
  }

  const isSamePassword = await passwordMatch(password, user.password as string);
  if (isSamePassword) {
    throw new CustomError(400, "Password must be different from old password");
  }

  const hashedPassword = await hashPassword(password);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpiry: null,
    },
  });

  // Sare existing session ko invalidate krna h bcuz of security
  await prisma.session.deleteMany({ where: { userId: user.id } });

  logger.info("Password reset successful", { email: user.email, userId: user.id, ip: req.ip });

  res.status(200).json(new ApiResponse(200, "Password reset successfully", null));
});

