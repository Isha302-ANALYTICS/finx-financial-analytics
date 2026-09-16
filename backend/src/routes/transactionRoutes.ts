import { Router, Request, Response } from "express";

import {
  getTransactions,
  getTransactionAnalytics,
} from "../controllers/TransactionController";

import {
  authenticateToken,
  AuthenticatedRequest,
} from "../middleware/authMiddleware";

// ============================================================
// FINX TRANSACTION ROUTER
// JWT PROTECTED | SEARCH | FILTER | SORT | PAGINATION
// ============================================================

const router = Router();

const API_MODULE = "FINX_TRANSACTION_CORE";

// ============================================================
// TRANSACTION STREAM
// GET /api/transactions
// ============================================================

router.get(
  "/",
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
    console.log(
      `[FINX] ${API_MODULE} → TRANSACTION_STREAM_REQUEST`,
      {
        timestamp: new Date().toISOString(),
        userId: req.user?.userId,
        role: req.user?.role,
        ip: req.ip,
        query: req.query,
      }
    );

    return getTransactions(req, res);
  }
);

// ============================================================
// FINANCIAL ANALYTICS
// GET /api/transactions/analytics
// ============================================================

router.get(
  "/analytics",
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
    console.log(
      `[FINX] ${API_MODULE} → ANALYTICS_ENGINE_REQUEST`,
      {
        timestamp: new Date().toISOString(),
        userId: req.user?.userId,
        role: req.user?.role,
        ip: req.ip,
      }
    );

    return getTransactionAnalytics(req, res);
  }
);

// ============================================================
// TRANSACTION ENGINE STATUS
// GET /api/transactions/status
// ============================================================

router.get(
  "/status",
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
    res.status(200).json({
      success: true,
      system: "FINX",
      module: API_MODULE,
      status: "ONLINE",
      service: "TRANSACTION_ENGINE",

      authenticatedUser: {
        userId: req.user?.userId,
        role: req.user?.role,
      },

      endpoints: {
        transactions: "ONLINE",
        analytics: "ONLINE",
        search: "ENABLED",
        filters: "ENABLED",
        sorting: "ENABLED",
        pagination: "ENABLED",
        jwtProtection: "ENABLED",
      },

      timestamp: new Date().toISOString(),
    });
  }
);

// ============================================================
// ROUTER EXPORT
// ============================================================

export default router;