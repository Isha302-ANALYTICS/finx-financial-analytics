import {
  Alert,
  AlertTitle,
  Box,
  Typography,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

interface ErrorAlertProps {
  message: string;
}

const ErrorAlert = ({ message }: ErrorAlertProps) => {
  return (
    <Alert
      icon={
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255, 59, 92, 0.12)",
            border: "1px solid rgba(255, 59, 92, 0.3)",
            boxShadow: "0 0 18px rgba(255, 59, 92, 0.18)",
          }}
        >
          <WarningAmberRoundedIcon
            sx={{
              color: "#ff4d6d",
              fontSize: 24,
            }}
          />
        </Box>
      }
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "16px",
        background:
          "linear-gradient(135deg, rgba(255,59,92,0.10), rgba(12,18,35,0.95))",
        border: "1px solid rgba(255,59,92,0.35)",
        color: "#ffffff",
        px: 2,
        py: 1.5,

        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          width: "3px",
          height: "100%",
          background: "#ff4d6d",
          boxShadow: "0 0 15px #ff4d6d",
        },

        "& .MuiAlert-message": {
          width: "100%",
        },
      }}
    >
      <AlertTitle
        sx={{
          color: "#ff6b81",
          fontWeight: 800,
          letterSpacing: "1.5px",
          fontSize: "12px",
          mb: 0.5,
        }}
      >
        SYSTEM ALERT
      </AlertTitle>

      <Typography
        sx={{
          color: "#c7cede",
          fontSize: "13px",
        }}
      >
        {message}
      </Typography>
    </Alert>
  );
};

export default ErrorAlert;