import { Box, Typography } from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

interface EmptyStateProps {
  title?: string;
  message?: string;
}

const EmptyState = ({
  title = "NO DATA FOUND",
  message = "There is currently no financial data to display.",
}: EmptyStateProps) => {
  return (
    <Box
      sx={{
        minHeight: 260,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        borderRadius: "18px",
        background:
          "linear-gradient(135deg, rgba(12,20,40,0.96), rgba(5,9,20,0.98))",
        border: "1px solid rgba(0,217,255,0.18)",
        boxShadow: "0 0 35px rgba(0,217,255,0.06)",
      }}
    >
      <Box
        sx={{
          width: 70,
          height: 70,
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,217,255,0.08)",
          border: "1px solid rgba(0,217,255,0.25)",
          boxShadow: "0 0 25px rgba(0,217,255,0.12)",
        }}
      >
        <InboxOutlinedIcon
          sx={{
            fontSize: 34,
            color: "#00d9ff",
          }}
        />
      </Box>

      <Typography
        sx={{
          mt: 2,
          color: "#ffffff",
          fontSize: "14px",
          fontWeight: 800,
          letterSpacing: "1.5px",
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          mt: 0.8,
          color: "#7f8ba5",
          fontSize: "12px",
          textAlign: "center",
          maxWidth: 360,
        }}
      >
        {message}
      </Typography>

      <Typography
        sx={{
          mt: 2,
          color: "#00d9ff",
          fontSize: "9px",
          letterSpacing: "2px",
          opacity: 0.7,
        }}
      >
        DATA STREAM • IDLE
      </Typography>
    </Box>
  );
};

export default EmptyState;