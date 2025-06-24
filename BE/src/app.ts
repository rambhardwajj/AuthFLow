import express from "express"
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import { env } from "./configs/env";
import { CustomError } from "./utils/CustomError";



const app = express()
app.use(helmet())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(cookieParser());

const allowedOrigins = [env.CLIENT_URL, "http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new CustomError(400, "Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

import healthRoutes from "./routes/health.routes";


app.use("/api/v1/healthcheck", healthRoutes);


export default app