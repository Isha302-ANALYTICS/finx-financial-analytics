import { Box, CircularProgress, Typography } from "@mui/material";

const Loader = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at center, #162447 0%, #080d1c 45%, #03050b 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow */}
      <Box
        sx={{
          position: "absolute",
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: "rgba(0, 200, 255, 0.12)",
          filter: "blur(60px)",
        }}
      />

      {/* Loader Ring */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress
          size={90}
          thickness={2}
          sx={{
            color: "#00d9ff",
            filter: "drop-shadow(0 0 12px rgba(0,217,255,0.8))",
          }}
        />

        <Typography
          sx={{
            position: "absolute",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "2px",
          }}
        >
          FA
        </Typography>
      </Box>

      {/* Text */}
      <Typography
        sx={{
          mt: 3,
          color: "#ffffff",
          fontSize: "18px",
          fontWeight: 600,
          letterSpacing: "1px",
        }}
      >
        FINANCIAL ANALYTICS
      </Typography>

      <Typography
        sx={{
          mt: 0.5,
          color: "#7d8ba8",
          fontSize: "12px",
          letterSpacing: "2px",
        }}
      >
        INITIALIZING SYSTEM...
      </Typography>

      {/* Status */}
      <Box
        sx={{
          mt: 3,
          px: 2,
          py: 0.8,
          border: "1px solid rgba(0,217,255,0.3)",
          borderRadius: "20px",
          background: "rgba(0,217,255,0.05)",
        }}
      >
        <Typography
          sx={{
            color: "#00d9ff",
            fontSize: "10px",
            letterSpacing: "1.5px",
          }}
        >
          ● SYSTEM ONLINE
        </Typography>
      </Box>
    </Box>
  );
};

export default Loader;