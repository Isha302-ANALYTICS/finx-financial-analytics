import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

const Sidebar = () => {
  const menuItems = [
    {
      label: "Dashboard",
      icon: <DashboardRoundedIcon />,
    },
    {
      label: "Transactions",
      icon: <ReceiptLongRoundedIcon />,
    },
    {
      label: "Analytics",
      icon: <AnalyticsRoundedIcon />,
    },
    {
      label: "Accounts",
      icon: <AccountBalanceRoundedIcon />,
    },
  ];

  return (
    <Box
      sx={{
        width: 250,
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        background:
          "linear-gradient(180deg, #0b1224 0%, #050914 100%)",
        borderRight: "1px solid rgba(0,217,255,0.15)",
        display: "flex",
        flexDirection: "column",
        zIndex: 1200,
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 3 }}>
        <Typography
          sx={{
            color: "#00d9ff",
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: 2,
          }}
        >
          FIN
          <span style={{ color: "#ffffff" }}>X</span>
        </Typography>

        <Typography
          sx={{
            color: "#65718a",
            fontSize: 9,
            letterSpacing: 2,
            mt: 0.5,
          }}
        >
          FINANCIAL INTELLIGENCE
        </Typography>
      </Box>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,0.06)",
        }}
      />

      {/* Navigation */}
      <List
        sx={{
          px: 1.5,
          py: 2,
        }}
      >
        {menuItems.map((item, index) => (
          <ListItemButton
            key={item.label}
            selected={index === 0}
            sx={{
              mb: 1,
              borderRadius: "12px",
              color: "#8792a8",
              transition: "all 0.25s ease",

              "&:hover": {
                color: "#00d9ff",
                background: "rgba(0,217,255,0.08)",
                transform: "translateX(3px)",
              },

              "&.Mui-selected": {
                color: "#00d9ff",
                background:
                  "linear-gradient(90deg, rgba(0,217,255,0.13), rgba(0,217,255,0.03))",
                border:
                  "1px solid rgba(0,217,255,0.16)",
                boxShadow:
                  "0 0 20px rgba(0,217,255,0.06)",
              },

              "&.Mui-selected:hover": {
                background:
                  "rgba(0,217,255,0.14)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 42,
                color: "inherit",
              }}
            >
              {item.icon}
            </ListItemIcon>

            <ListItemText
              primary={
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "inherit",
                  }}
                >
                  {item.label}
                </Typography>
              }
            />
          </ListItemButton>
        ))}
      </List>

      {/* System Status */}
      <Box
        sx={{
          mx: 2,
          mt: "auto",
          mb: 2,
          p: 2,
          borderRadius: "14px",
          background: "rgba(0,217,255,0.05)",
          border:
            "1px solid rgba(0,217,255,0.15)",
          boxShadow:
            "inset 0 0 20px rgba(0,217,255,0.02)",
        }}
      >
        <Typography
          sx={{
            color: "#00e676",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          ● SYSTEM ONLINE
        </Typography>

        <Typography
          sx={{
            color: "#647089",
            fontSize: 10,
            mt: 0.5,
          }}
        >
          All services operational
        </Typography>
      </Box>

      {/* User */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderTop:
            "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
            background: "#123047",
            color: "#00d9ff",
            border:
              "1px solid rgba(0,217,255,0.2)",
          }}
        >
          U
        </Avatar>

        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              color: "#ffffff",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            User
          </Typography>

          <Typography
            sx={{
              color: "#65718a",
              fontSize: 10,
              mt: 0.3,
            }}
          >
            Financial Analyst
          </Typography>
        </Box>

        <LogoutRoundedIcon
          sx={{
            color: "#65718a",
            fontSize: 20,
            cursor: "pointer",
            transition: "0.2s",

            "&:hover": {
              color: "#ff4d6d",
              filter:
                "drop-shadow(0 0 8px rgba(255,77,109,0.5))",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Sidebar;