import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/CustomError";
import jwt, { TokenExpiredError } from "jsonwebtoken"
import { env } from "../configs/env";
import { decodedUser } from "../types";

export const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken } = req.cookies;
  console.log(accessToken)
  if (!accessToken) throw new CustomError(401, "You must be logged in to access this resource.");
  try {
    const decoded = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET)
    req.user = decoded as decodedUser;

    next();

  } catch (error) {
    if(error instanceof TokenExpiredError){
        throw new CustomError(401, error.name);
    }
    throw new CustomError(401, "Invalid or expired token")
  }
};

