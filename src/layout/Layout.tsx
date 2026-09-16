import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 80% 10%, rgba(0,217,255,0.07), transparent 25%), #040812",

        "&::before": {
          content: '""',
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.25,
          backgroundImage:
            "linear-gradient(rgba(0,217,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,0.035) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        },
      }}
    >
      <Sidebar />
      <Header />

      <Box
        component="main"
        sx={{
          ml: "250px",
          pt: "100px",
          px: { xs: 2, md: 4 },
          pb: 5,
          minHeight: "100vh",
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;