import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

// ============================================================
// FINX AUTHENTICATION CORE
// REGISTER | LOGIN | JWT | IDENTITY
// ============================================================

// ============================================================
// JWT TOKEN GENERATOR
// ============================================================

const generateToken = (
  userId: string,
  role: string
): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "FINX_SECURITY_ERROR: JWT_SECRET is not configured"
    );
  }

  return jwt.sign(
    {
      userId,
      role,
    },
    secret,
    {
      expiresIn: "1d",
    }
  );
};

// ============================================================
// REGISTER USER
// POST /api/auth/register
// ============================================================

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, role } = req.body;

    // --------------------------------------------------------
    // Validate input
    // --------------------------------------------------------

    if (!email || !password) {
      res.status(400).json({
        success: false,
        system: "FINX",
        error: "MISSING_CREDENTIALS",
        message:
          "Email and password are required.",
      });

      return;
    }

    // --------------------------------------------------------
    // Normalize email
    // --------------------------------------------------------

    const normalizedEmail =
      String(email).trim().toLowerCase();

    // --------------------------------------------------------
    // Check existing user
    // --------------------------------------------------------

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      res.status(409).json({
        success: false,
        system: "FINX",
        error: "USER_ALREADY_EXISTS",
        message:
          "An account with this email already exists.",
      });

      return;
    }

    // --------------------------------------------------------
    // Create user
    // Password hashing happens automatically
    // inside User.ts pre-save middleware.
    // --------------------------------------------------------

    const user = await User.create({
      email: normalizedEmail,
      password,
      role:
        role === "admin"
          ? "admin"
          : "user",
    });

    // --------------------------------------------------------
    // Generate JWT
    // --------------------------------------------------------

    const token = generateToken(
      user._id.toString(),
      user.role
    );

    // --------------------------------------------------------
    // FINX response
    // --------------------------------------------------------

    res.status(201).json({
      success: true,
      system: "FINX",
      message:
        "User registered successfully.",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error(
      "FINX_REGISTER_ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      system: "FINX",
      error: "REGISTRATION_FAILED",
      message:
        "Unable to register user.",
      timestamp: new Date().toISOString(),
    });
  }
};

// ============================================================
// LOGIN USER
// POST /api/auth/login
// ============================================================

export const loginUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // --------------------------------------------------------
    // Validate credentials
    // --------------------------------------------------------

    if (!email || !password) {
      res.status(400).json({
        success: false,
        system: "FINX",
        error: "MISSING_CREDENTIALS",
        message:
          "Email and password are required.",
      });

      return;
    }

    // --------------------------------------------------------
    // Normalize email
    // --------------------------------------------------------

    const normalizedEmail =
      String(email).trim().toLowerCase();

    // --------------------------------------------------------
    // Find user
    // --------------------------------------------------------

    const user =
      await User.findOne({
        email: normalizedEmail,
      });

    if (!user) {
      res.status(401).json({
        success: false,
        system: "FINX",
        error: "INVALID_CREDENTIALS",
        message:
          "Invalid email or password.",
      });

      return;
    }

    // --------------------------------------------------------
    // Verify password
    // --------------------------------------------------------

    const passwordMatch =
      await user.comparePassword(
        password
      );

    if (!passwordMatch) {
      res.status(401).json({
        success: false,
        system: "FINX",
        error: "INVALID_CREDENTIALS",
        message:
          "Invalid email or password.",
      });

      return;
    }

    // --------------------------------------------------------
    // Generate JWT
    // --------------------------------------------------------

    const token = generateToken(
      user._id.toString(),
      user.role
    );

    // --------------------------------------------------------
    // FINX login response
    // --------------------------------------------------------

    res.status(200).json({
      success: true,
      system: "FINX",
      message:
        "Authentication successful.",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error(
      "FINX_LOGIN_ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      system: "FINX",
      error: "LOGIN_FAILED",
      message:
        "Unable to authenticate user.",
      timestamp: new Date().toISOString(),
    });
  }
};

// ============================================================
// AUTHENTICATION STATUS
// GET /api/auth/status
// ============================================================

export const authStatus = (
  _req: Request,
  res: Response
): void => {
  res.status(200).json({
    success: true,
    system: "FINX",
    module: "AUTHENTICATION_CORE",
    status: "ONLINE",
    register: "ENABLED",
    login: "ENABLED",
    jwt: "ENABLED",
    passwordHashing: "ENABLED",
    timestamp: new Date().toISOString(),
  });
};