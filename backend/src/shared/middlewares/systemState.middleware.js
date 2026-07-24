import { StatusCodes } from "http-status-codes";
import { systemStateStore } from "../core/systemStateStore.js";
import { logger } from "../../config/logger.js";

// Pre-compiled Regex for maximum speed: O(1) matching for static extensions
const STATIC_ASSET_REGEX = /\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|woff|woff2|ttf|eot|mp4|webm)$/i;

// Categorized Whitelist
const isWhitelistedPath = (path) => {
  const WHITELIST = [
    "/api/v1/auth/",     // Authentication (Login/Refresh)
    "/api/v1/admin/",    // Admin Panel APIs
    "/api/v1/health",    // AWS/Docker Health checks
    "/api/v1/uploads/",  // Media uploads by Admins
    "/robots.txt",       // SEO
    "/sitemap.xml",      // SEO
    "/sitemap-pages.xml",// SEO
    "/sitemap-blogs.xml" // SEO
  ];
  return WHITELIST.some(prefix => path.startsWith(prefix) || path === prefix);
};

export const systemStateGatekeeper = (req, res, next) => {
  const config = systemStateStore.get();

  // If System is ACTIVE, instantly proceed
  if (!config || config.state === "ACTIVE") {
    return next();
  }

  const reqPath = req.path;

  // Fast-pass for Static Assets (Bypassing exact path checks)
  if (STATIC_ASSET_REGEX.test(reqPath)) {
    return next();
  }

  // Fast-pass for categorized Whitelisted Routes
  if (isWhitelistedPath(reqPath)) {
    return next();
  }

  //  The Stakeholder Bypass Logic (Magic Link Check)
  const bypassQueryToken = req.query.maintenance_bypass;
  const bypassCookieToken = req.cookies?.maintenance_bypass_token;

  // If a valid token is passed in the URL, set a secure HTTP-Only cookie for future requests
  if (bypassQueryToken && bypassQueryToken === config.bypassToken) {
    res.cookie("maintenance_bypass_token", bypassQueryToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours validity
    });
    logger.info(`Maintenance bypass cookie granted to IP: ${req.ip}`);
    return next(); // Allow request
  }

  // If the browser already has the valid cookie, let them through
  if (bypassCookieToken && bypassCookieToken === config.bypassToken) {
    return next(); // Allow request
  }

  // Enforce Maintenance Mode (Strict SEO & Caching Headers)
  res.set("Retry-After", "3600"); // Tells Google to check back in 1 hour
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");

  // Return exactly what the frontend needs to render the Maintenance UI
  return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
    success: false,
    isMaintenance: true,
    state: config.state,
    meta: {
      title: config.title,
      description: config.description,
      estimatedCompletion: config.estimatedCompletion,
      supportEmail: config.supportEmail,
      supportPhone: config.supportPhone,
      showSocialLinks: config.showSocialLinks
    }
  });
};