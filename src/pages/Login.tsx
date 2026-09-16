import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";

import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email && password) {
      navigate("/dashboard");
    }
  };

  const textFieldSx = {
    "& .MuiInputBase-root": {
      height: 52,
      color: "#ffffff",
      background: "rgba(255,255,255,0.035)",
      borderRadius: "12px",
      border: "1px solid rgba(0,217,255,0.12)",
      transition: "all 0.3s ease",
    },

    "& .MuiInputBase-root:hover": {
      borderColor: "rgba(0,217,255,0.35)",
    },

    "& .MuiInputBase-root.Mui-focused": {
      borderColor: "#00d9ff",
      boxShadow: "0 0 20px rgba(0,217,255,0.12)",
    },

    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },

    "& input::placeholder": {
      color: "#68758f",
      opacity: 1,
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 20% 20%, rgba(0,217,255,0.08), transparent 30%), radial-gradient(circle at 80% 80%, rgba(124,77,255,0.08), transparent 30%), #050a16",
        px: 2,
      }}
    >
      {/* Background grid */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.18,
          backgroundImage:
            "linear-gradient(rgba(0,217,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,0.08) 1px, transparent 1px)",
          backgroundSize: "45px 45px",
          pointerEvents: "none",
        }}
      />

      {/* Cyan glow */}
      <Box
        sx={{
          position: "absolute",
          width: 420,
          height: 420,
          top: -180,
          left: -180,
          borderRadius: "50%",
          background: "rgba(0,217,255,0.07)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* Purple glow */}
      <Box
        sx={{
          position: "absolute",
          width: 420,
          height: 420,
          bottom: -180,
          right: -180,
          borderRadius: "50%",
          background: "rgba(124,77,255,0.08)",
          filter: "blur(90px)",
          pointerEvents: "none",
        }}
      />

      {/* Login Card */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 440,
          p: { xs: 3, sm: 4 },
          borderRadius: "24px",
          background:
            "linear-gradient(145deg, rgba(15,27,52,0.96), rgba(5,10,22,0.98))",
          border: "1px solid rgba(0,217,255,0.18)",
          boxShadow:
            "0 25px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2.5,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "18px",
              background: "rgba(0,217,255,0.08)",
              border: "1px solid rgba(0,217,255,0.3)",
              color: "#00d9ff",
              boxShadow:
                "0 0 35px rgba(0,217,255,0.15), inset 0 0 20px rgba(0,217,255,0.05)",
            }}
          >
            <AutoGraphRoundedIcon sx={{ fontSize: 34 }} />
          </Box>
        </Box>

        {/* Heading */}
        <Typography
          align="center"
          sx={{
            color: "#ffffff",
            fontSize: 28,
            fontWeight: 900,
            letterSpacing: "-0.5px",
          }}
        >
          Financial Analytics
        </Typography>

        <Typography
          align="center"
          sx={{
            color: "#00d9ff",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: 2,
            mt: 0.8,
          }}
        >
          FINANCIAL CONTROL CENTER
        </Typography>

        <Typography
          align="center"
          sx={{
            color: "#68758f",
            fontSize: 12,
            mt: 1.5,
            mb: 3.5,
          }}
        >
          Sign in to access your financial dashboard
        </Typography>

        {/* Email */}
        <Typography
          sx={{
            color: "#8793a8",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1,
            mb: 0.8,
          }}
        >
          EMAIL
        </Typography>

        <TextField
          fullWidth
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={textFieldSx}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <EmailRoundedIcon
                    sx={{
                      color: "#00d9ff",
                      fontSize: 20,
                    }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Password */}
        <Typography
          sx={{
            color: "#8793a8",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1,
            mb: 0.8,
            mt: 2.5,
          }}
        >
          PASSWORD
        </Typography>

        <TextField
          fullWidth
          placeholder="Enter your password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={textFieldSx}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockRoundedIcon
                    sx={{
                      color: "#00d9ff",
                      fontSize: 20,
                    }}
                  />
                </InputAdornment>
              ),

              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOffRoundedIcon
                        sx={{ color: "#68758f" }}
                      />
                    ) : (
                      <VisibilityRoundedIcon
                        sx={{ color: "#68758f" }}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Login Button */}
        <Button
          fullWidth
          onClick={handleLogin}
          sx={{
            mt: 3.5,
            height: 52,
            borderRadius: "12px",
            color: "#031018",
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: 1.5,
            background:
              "linear-gradient(90deg, #00d9ff, #00e5ff)",
            boxShadow:
              "0 0 25px rgba(0,217,255,0.22)",
            transition: "all 0.3s ease",

            "&:hover": {
              background:
                "linear-gradient(90deg, #00e5ff, #00d9ff)",
              transform: "translateY(-2px)",
              boxShadow:
                "0 8px 30px rgba(0,217,255,0.3)",
            },
          }}
        >
          SIGN IN
        </Button>

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.8,
            mt: 3,
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#00e676",
              boxShadow: "0 0 8px #00e676",
            }}
          />

          <Typography
            sx={{
              color: "#536078",
              fontSize: 9,
              letterSpacing: 1,
            }}
          >
            SECURE FINANCIAL ACCESS
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;