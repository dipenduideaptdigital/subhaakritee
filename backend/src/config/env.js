import dotenv from "dotenv";
import { cleanEnv, str, port } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ default: "development" }),
  PORT: port({ default: 5000 }),
  DATABASE_URL: str(),
  JWT_ACCESS_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  ACCESS_TOKEN_EXPIRES_IN: str({ default: "15m" }),
  REFRESH_TOKEN_EXPIRES_IN: str({ default: "7d" }),
  CLIENT_URL: str(),
  TRUST_PROXY: str({ default: "false" }), 
  SUPER_ADMIN_NAME: str(),
  SUPER_ADMIN_EMAIL: str(),
  SUPER_ADMIN_PASSWORD: str(),
  PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES: str({ default: "15" }),
  SMTP_HOST: str(),
  SMTP_PORT: str(),
  SMTP_USER: str(),
  SMTP_PASS: str(),
  FROM_EMAIL: str(),
  FROM_NAME: str(),

  RECAPTCHA_SECRET_KEY: str({ default: "" }), 
  CLOUDINARY_CLOUD_NAME: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_API_SECRET: str(),
});