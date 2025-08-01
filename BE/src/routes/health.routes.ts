import { Router } from "express";
import { healthCheck } from "../controllers/healthCheck.controller";

const router = Router();

router.get("/", healthCheck);

export default router;