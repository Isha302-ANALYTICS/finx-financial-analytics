import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Badge,
} from "@mui/material";

import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import WifiRoundedIcon from "@mui/icons-material/WifiRounded";

const Header = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        ml: "250px",
        width: "calc(100% - 250px)",
        background: "rgba(4, 9, 20, 0.78)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0, 217, 255, 0.14)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "76px !important",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "#ffffff",
              fontSize: 19,
              fontWeight: 800,
              letterSpacing: 0.5,
            }}
          >
            Financial{" "}
            <Box component="span" sx={{ color: "#00d9ff" }}>
              Analytics
            </Box>
          </Typography>

          <Typography
            sx={{
              color: "#66758f",
              fontSize: 9,
              letterSpacing: 2,
              mt: 0.4,
            }}
          >
            REAL-TIME FINANCIAL INTELLIGENCE
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.7,
              px: 1.5,
              py: 0.8,
              borderRadius: "20px",
              background: "rgba(0, 230, 118, 0.06)",
              border: "1px solid rgba(0, 230, 118, 0.18)",
            }}
          >
            <WifiRoundedIcon
              sx={{
                fontSize: 15,
                color: "#00e676",
              }}
            />

            <Typography
              sx={{
                color: "#00e676",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              LIVE
            </Typography>
          </Box>

          <IconButton
            sx={{
              width: 42,
              height: 42,
              color: "#9aa7bd",
              border: "1px solid rgba(0,217,255,0.12)",
              background: "rgba(255,255,255,0.025)",
              "&:hover": {
                color: "#00d9ff",
                background: "rgba(0,217,255,0.08)",
                boxShadow: "0 0 18px rgba(0,217,255,0.15)",
              },
            }}
          >
            <Badge
              variant="dot"
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "#00d9ff",
                  boxShadow: "0 0 8px #00d9ff",
                },
              }}
            >
              <NotificationsNoneRoundedIcon />
            </Badge>
          </IconButton>

          <Avatar
            sx={{
              width: 40,
              height: 40,
              background:
                "linear-gradient(135deg, #123b55, #071525)",
              color: "#00d9ff",
              border: "1px solid rgba(0,217,255,0.3)",
              boxShadow: "0 0 15px rgba(0,217,255,0.12)",
              fontWeight: 700,
            }}
          >
            U
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;