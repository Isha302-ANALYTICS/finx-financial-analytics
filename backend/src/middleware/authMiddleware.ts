import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// ============================================================
// FINX SECURITY CORE
// JWT AUTHENTICATION MIDDLEWARE
// ============================================================

export interface AuthenticatedRequest
  extends Request {
  user?: {
    userId: string;
    role: "admin" | "user";
  };
}

// ============================================================
// JWT PAYLOAD
// ============================================================

interface JwtPayload {
  userId: string;
  role: "admin" | "user";
  iat?: number;
  exp?: number;
}

// ============================================================
// VERIFY JWT TOKEN
// ============================================================

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader =
      req.headers.authorization;

    // --------------------------------------------------------
    // Authorization header missing
    // --------------------------------------------------------

    if (!authHeader) {
      res.status(401).json({
        success: false,
        system: "FINX",
        error: "AUTHENTICATION_REQUIRED",
        message:
          "Authorization token is required.",
        timestamp:
          new Date().toISOString(),
      });

      return;
    }

    // --------------------------------------------------------
    // Expected format:
    // Authorization: Bearer <JWT>
    // --------------------------------------------------------

    const [scheme, token] =
      authHeader.split(" ");

    if (
      scheme !== "Bearer" ||
      !token
    ) {
      res.status(401).json({
        success: false,
        system: "FINX",
        error: "INVALID_AUTH_HEADER",
        message:
          "Authorization header must use Bearer token format.",
        timestamp:
          new Date().toISOString(),
      });

      return;
    }

    // --------------------------------------------------------
    // JWT secret
    // --------------------------------------------------------

    const secret =
      process.env.JWT_SECRET;

    if (!secret) {
      console.error(
        "FINX_SECURITY_ERROR: JWT_SECRET is not configured"
      );

      res.status(500).json({
        success: false,
        system: "FINX",
        error: "JWT_CONFIGURATION_ERROR",
        message:
          "Authentication service is not configured correctly.",
        timestamp:
          new Date().toISOString(),
      });

      return;
    }

    // --------------------------------------------------------
    // Verify token
    // --------------------------------------------------------

    const decoded =
      jwt.verify(
        token,
        secret
      ) as JwtPayload;

    // --------------------------------------------------------
    // Validate payload
    // --------------------------------------------------------

    if (
      !decoded.userId ||
      !decoded.role
    ) {
      res.status(401).json({
        success: false,
        system: "FINX",
        error: "INVALID_TOKEN_PAYLOAD",
        message:
          "Authentication token payload is invalid.",
        timestamp:
          new Date().toISOString(),
      });

      return;
    }

    // --------------------------------------------------------
    // Attach authenticated user
    // --------------------------------------------------------

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    console.log(
      `[FINX] AUTHORIZED_REQUEST`,
      {
        userId: decoded.userId,
        role: decoded.role,
        timestamp:
          new Date().toISOString(),
      }
    );

    next();

  } catch (error) {
    console.error(
      "FINX_JWT_VERIFICATION_ERROR:",
      error
    );

    res.status(401).json({
      success: false,
      system: "FINX",
      error: "INVALID_OR_EXPIRED_TOKEN",
      message:
        "Authentication token is invalid or expired.",
      timestamp:
        new Date().toISOString(),
    });
  }
};

// ============================================================
// ADMIN ACCESS CONTROL
// ============================================================

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      system: "FINX",
      error: "AUTHENTICATION_REQUIRED",
      message:
        "Authentication is required.",
      timestamp:
        new Date().toISOString(),
    });

    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({
      success: false,
      system: "FINX",
      error: "ADMIN_ACCESS_REQUIRED",
      message:
        "Administrator privileges are required.",
      timestamp:
        new Date().toISOString(),
    });

    return;
  }

  next();
};