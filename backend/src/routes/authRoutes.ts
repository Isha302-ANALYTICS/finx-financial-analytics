import { Router, Request, Response } from "express";

import {
  registerUser,
  loginUser,
  authStatus,
} from "../controllers/authController";

// ============================================================
// FINX AUTHENTICATION ROUTER
// REGISTER | LOGIN | JWT | STATUS
// ============================================================

const router = Router();

const API_MODULE = "FINX_AUTHENTICATION_CORE";

// ============================================================
// REGISTER
// POST /api/auth/register
// ============================================================

router.post(
  "/register",
  (req: Request, res: Response) => {
    console.log(
      `[FINX] ${API_MODULE} → REGISTER_REQUEST`,
      {
        timestamp:
          new Date().toISOString(),
        ip: req.ip,
      }
    );

    return registerUser(req, res);
  }
);

// ============================================================
// LOGIN
// POST /api/auth/login
// ============================================================

router.post(
  "/login",
  (req: Request, res: Response) => {
    console.log(
      `[FINX] ${API_MODULE} → LOGIN_REQUEST`,
      {
        timestamp:
          new Date().toISOString(),
        ip: req.ip,
      }
    );

    return loginUser(req, res);
  }
);

// ============================================================
// AUTHENTICATION STATUS
// GET /api/auth/status
// ============================================================

router.get(
  "/status",
  (_req: Request, res: Response) => {
    console.log(
      `[FINX] ${API_MODULE} → STATUS_REQUEST`,
      {
        timestamp:
          new Date().toISOString(),
      }
    );

    return authStatus(_req, res);
  }
);

// ============================================================
// ROUTER EXPORT
// ============================================================

export default router;