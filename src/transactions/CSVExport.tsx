import { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  Checkbox,
  ListItemText,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { Parser } from "json2csv";
import transactions from "../data/transactions.json";

const allColumns = [
  { key: "id", label: "Transaction ID" },
  { key: "date", label: "Date" },
  { key: "amount", label: "Amount" },
  { key: "category", label: "Category" },
  { key: "status", label: "Status" },
  { key: "user_id", label: "User ID" },
  { key: "user_profile", label: "User Profile" },
];

function CSVExport() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    allColumns.map((column) => column.key)
  );

  const handleToggleColumn = (key: string) => {
    setSelectedColumns((current) =>
      current.includes(key)
        ? current.filter((column) => column !== key)
        : [...current, key]
    );
  };

  const handleExport = () => {
    if (selectedColumns.length === 0) {
      alert("SELECT AT LEAST ONE COLUMN");
      return;
    }

    const fields = allColumns
      .filter((column) => selectedColumns.includes(column.key))
      .map((column) => ({
        label: column.label,
        value: column.key,
      }));

    const parser = new Parser({ fields });
    const csv = parser.parse(transactions);

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "FINX_financial_transactions.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    setAnchorEl(null);
  };

  return (
    <>
      <Button
        onClick={(event) => setAnchorEl(event.currentTarget)}
        startIcon={<DownloadIcon />}
        sx={{
          px: 2.5,
          py: 1.2,
          color: "#00f5ff",
          fontWeight: 800,
          letterSpacing: "1px",
          border: "1px solid rgba(0,245,255,0.45)",
          borderRadius: "10px",
          background:
            "linear-gradient(135deg, rgba(0,245,255,0.12), rgba(124,77,255,0.12))",
          boxShadow:
            "0 0 18px rgba(0,245,255,0.15), inset 0 0 15px rgba(0,245,255,0.04)",
          backdropFilter: "blur(12px)",
          transition: "all 0.25s ease",

          "&:hover": {
            color: "#ffffff",
            border: "1px solid #00f5ff",
            background:
              "linear-gradient(135deg, rgba(0,245,255,0.25), rgba(124,77,255,0.25))",
            boxShadow:
              "0 0 25px rgba(0,245,255,0.35), 0 0 45px rgba(124,77,255,0.15)",
            transform: "translateY(-2px)",
          },
        }}
      >
        EXPORT DATA
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 270,
              p: 1,
              color: "#ffffff",
              background:
                "linear-gradient(145deg, rgba(8,15,30,0.98), rgba(15,10,35,0.98))",
              border: "1px solid rgba(0,245,255,0.35)",
              borderRadius: "14px",
              backdropFilter: "blur(20px)",
              boxShadow:
                "0 0 30px rgba(0,245,255,0.18), 0 0 60px rgba(124,77,255,0.12)",
            },
          },
        }}
      >
        <Box sx={{ px: 1.5, py: 1 }}>
          <Typography
            sx={{
              color: "#00f5ff",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "1.5px",
            }}
          >
            EXPORT CONFIGURATION
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "11px",
              mt: 0.5,
            }}
          >
            SELECT DATA COLUMNS
          </Typography>
        </Box>

        <Divider
          sx={{
            borderColor: "rgba(0,245,255,0.15)",
            mb: 0.5,
          }}
        />

        {allColumns.map((column) => (
          <MenuItem
            key={column.key}
            onClick={() => handleToggleColumn(column.key)}
            sx={{
              borderRadius: "8px",
              mb: 0.3,
              color: "#d8faff",

              "&:hover": {
                background: "rgba(0,245,255,0.10)",
              },
            }}
          >
            <Checkbox
              checked={selectedColumns.includes(column.key)}
              sx={{
                color: "rgba(0,245,255,0.4)",

                "&.Mui-checked": {
                  color: "#00f5ff",
                },
              }}
            />

            <ListItemText
              primary={
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  {column.label}
                </Typography>
              }
            />
          </MenuItem>
        ))}

        <Divider
          sx={{
            borderColor: "rgba(0,245,255,0.15)",
            my: 0.7,
          }}
        />

        <MenuItem
          onClick={handleExport}
          sx={{
            justifyContent: "center",
            borderRadius: "9px",
            py: 1.2,
            color: "#050b16",
            fontWeight: 900,
            letterSpacing: "1px",
            background:
              "linear-gradient(90deg, #00f5ff, #7c4dff)",
            boxShadow: "0 0 20px rgba(0,245,255,0.25)",

            "&:hover": {
              background:
                "linear-gradient(90deg, #00e5ff, #9c6cff)",
              boxShadow: "0 0 30px rgba(0,245,255,0.45)",
            },
          }}
        >
          <DownloadIcon sx={{ mr: 1 }} />
          DOWNLOAD CSV
        </MenuItem>
      </Menu>
    </>
  );
}

export default CSVExport;