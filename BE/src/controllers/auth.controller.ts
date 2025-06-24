import ms, { StringValue } from "ms";
import { uploadOnCloudinary } from "../configs/coudinary";
import { prisma } from "../configs/db";
import { env } from "../configs/env";
import { logger } from "../configs/logger";
import { ApiResponse } from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { CustomError } from "../utils/CustomError";
import { handleZodError } from "../utils/handleZodError";
import { createHash, generateAccessToken, generateRefreshToken, generateToken, hashPassword } from "../utils/helper";
import { sanitizeUser } from "../utils/sanitizeUser";
import { sendVerificationMail } from "../utils/sendMail";
import { validateRegister } from "../validations/auth.validation";
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