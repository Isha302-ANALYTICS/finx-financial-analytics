import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===============================
// FINX CORE CONFIGURATION
// ===============================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// ===============================
// SYSTEM STATUS
// ===============================

app.get("/", (_req, res) => {
  res.status(200).json({
    system: "FINX",
    service: "Financial Analytics API",
    status: "ONLINE",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ===============================
// HEALTH MONITOR
// ===============================

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    system: "FINX",
    status: "OPERATIONAL",
    database: "PENDING",
    authentication: "PENDING",
    api: "ONLINE",
    timestamp: new Date().toISOString(),
  });
});

// ===============================
// 404 HANDLER
// ===============================

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: "API_ENDPOINT_NOT_FOUND",
    message: "The requested FINX endpoint does not exist.",
  });
});

// ===============================
// GLOBAL ERROR HANDLER
// ===============================

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("FINX_SYSTEM_ERROR:", err);

    res.status(500).json({
      success: false,
      error: "INTERNAL_SERVER_ERROR",
      message: "An unexpected server error occurred.",
    });
  }
);

// ===============================
// START FINX API
// ===============================

app.listen(PORT, () => {
  console.log("");
  console.log("╔══════════════════════════════════════╗");
  console.log("║          FINX CORE SYSTEM            ║");
  console.log("╠══════════════════════════════════════╣");
  console.log(`║  API     : http://localhost:${PORT}    ║`);
  console.log("║  STATUS  : ● ONLINE                  ║");
  console.log("║  MODE    : DEVELOPMENT               ║");
  console.log("╚══════════════════════════════════════╝");
  console.log("");
});