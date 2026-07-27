import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import routes from "./routes/index.js";
import { env } from "./config/env.js";
import { globalErrorHandler } from "./shared/middlewares/error.middleware.js";
import { notFoundHandler } from "./shared/middlewares/notFound.middleware.js";
import { systemStateGatekeeper } from "./shared/middlewares/systemState.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const parsedClientUrl = env.CLIENT_URL ? env.CLIENT_URL.trim().replace(/\/$/, "") : "";

app.set("trust proxy", 1);

app.use((req, res, next) => {
  req.id = crypto.randomUUID(); 
  res.setHeader("X-Request-ID", req.id); 
  next();
});

const allowedOriginsWhitelistArray = [
  env.CLIENT_URL ? env.CLIENT_URL.trim().replace(/\/$/, "") : "",
  process.env.PRODUCTION_CDN_ASSETS_SERVER_URL ? process.env.PRODUCTION_CDN_ASSETS_SERVER_URL.trim().replace(/\/$/, "") : ""
].filter(Boolean);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, 
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'", 
          "'unsafe-inline'", 
          "https://www.google.com/recaptcha/", 
          "https://www.gstatic.com/recaptcha/"
        ], 
        frameSrc: [
          "'self'", 
          "https://www.youtube.com", 
          "https://www.google.com/recaptcha/",
          "https://recaptcha.google.com/recaptcha/"
        ], 
        imgSrc: ["'self'", "data:", "blob:", "*"],
        connectSrc: ["'self'", ...allowedOriginsWhitelistArray] 
      }
    }
  })
);

const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 500, 
  standardHeaders: true, 
  legacyHeaders: false, 
  message: {
    success: false,
    message: "High volume request sequence stream capacity checkpoint reached from local identity fingerprint layout profile. Connection pool path routes locked temporarily for 15 minutes."
  }
});

app.use("/api", globalRateLimiter);

app.use(hpp()); 
app.use(compression({ filter: (req, res) => req.headers["x-no-compression"] ? false : compression.filter(req, res) }));

app.use(
  cors({
    origin: parsedClientUrl, 
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "X-Request-ID"]
  })
);

app.use(cookieParser());
app.use(systemStateGatekeeper);
app.use(express.json({ limit: "2mb" })); 
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

const PUBLIC_UPLOADS_PATH = path.resolve(__dirname, "../public/uploads");
app.use("/uploads", express.static(PUBLIC_UPLOADS_PATH, {
  maxAge: "31536000",
  immutable: true,
  fallthrough: true 
}));

app.use("/api/v1", routes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;