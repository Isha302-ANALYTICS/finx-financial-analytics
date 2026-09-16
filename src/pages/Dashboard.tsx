import { Box, Typography } from "@mui/material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";

import SummaryCards from "../components/dashboard/SummaryCards";
import RevenueExpenseChart from "../components/dashboard/RevenueExpenseChart";
import CategoryBreakdown from "../components/dashboard/CategoryBreakdown";

const Dashboard = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        background: "#050a16",
        overflow: "hidden",
      }}
    >
      {/* Background Grid */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          opacity: 0.12,
          backgroundImage:
            "linear-gradient(rgba(0,217,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,0.08) 1px, transparent 1px)",
          backgroundSize: "45px 45px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Top Cyan Glow */}
      <Box
        sx={{
          position: "fixed",
          width: 500,
          height: 500,
          top: -250,
          right: -150,
          borderRadius: "50%",
          background: "rgba(0,217,255,0.07)",
          filter: "blur(100px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Bottom Purple Glow */}
      <Box
        sx={{
          position: "fixed",
          width: 450,
          height: 450,
          bottom: -250,
          left: -180,
          borderRadius: "50%",
          background: "rgba(124,77,255,0.06)",
          filter: "blur(100px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Main Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1600,
          mx: "auto",
          p: { xs: 2, sm: 3, lg: 4 },
        }}
      >
        {/* Dashboard Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: 2,
            mb: 3,
            p: { xs: 2.5, md: 3 },
            borderRadius: "20px",
            background:
              "linear-gradient(135deg, rgba(13,25,48,0.92), rgba(5,10,22,0.82))",
            border: "1px solid rgba(0,217,255,0.14)",
            backdropFilter: "blur(18px)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.04), 0 15px 40px rgba(0,0,0,0.25)",
          }}
        >
          {/* Title Section */}
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1,
              }}
            >
              <AutoGraphRoundedIcon
                sx={{
                  color: "#00d9ff",
                  fontSize: 19,
                  filter:
                    "drop-shadow(0 0 8px rgba(0,217,255,0.7))",
                }}
              />

              <Typography
                sx={{
                  color: "#00d9ff",
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: 2,
                }}
              >
                FINANCIAL CONTROL CENTER
              </Typography>
            </Box>

            <Typography
              sx={{
                color: "#ffffff",
                fontSize: {
                  xs: 26,
                  md: 32,
                },
                fontWeight: 900,
                letterSpacing: "-1px",
              }}
            >
              Dashboard
            </Typography>

            <Typography
              sx={{
                color: "#71809a",
                fontSize: 12,
                mt: 0.8,
              }}
            >
              Monitor your financial performance, revenue and expenses.
            </Typography>
          </Box>

          {/* Data Status */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              px: 2,
              py: 1.3,
              borderRadius: "14px",
              background: "rgba(0,217,255,0.04)",
              border: "1px solid rgba(0,217,255,0.16)",
              minWidth: 155,
            }}
          >
            <AccessTimeRoundedIcon
              sx={{
                color: "#00d9ff",
                fontSize: 18,
              }}
            />

            <Box>
              <Typography
                sx={{
                  color: "#66758f",
                  fontSize: 8,
                  letterSpacing: 1.5,
                }}
              >
                DATA STATUS
              </Typography>

              <Typography
                sx={{
                  color: "#00e676",
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: 1,
                  mt: 0.2,
                }}
              >
                ● LIVE & SYNCED
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Summary Cards */}
        <Box sx={{ mb: 2.5 }}>
          <SummaryCards />
        </Box>

        {/* Analytics Section */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, 2fr) minmax(320px, 1fr)",
            },
            gap: 2.5,
          }}
        >
          <RevenueExpenseChart />
          <CategoryBreakdown />
        </Box>

        {/* System Footer */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2.5,
            px: 1,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography
            sx={{
              color: "#39465c",
              fontSize: 8,
              letterSpacing: 1.2,
            }}
          >
            FINANCIAL ANALYTICS SYSTEM
          </Typography>

          <Typography
            sx={{
              color: "#39465c",
              fontSize: 8,
              letterSpacing: 1.2,
            }}
          >
            SYSTEM STATUS: ONLINE
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;