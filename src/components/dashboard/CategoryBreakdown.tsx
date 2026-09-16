import { Box, Typography } from "@mui/material";
import PieChartRoundedIcon from "@mui/icons-material/PieChartRounded";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

import transactions from "../../data/transactions.json";

type Transaction = {
  id: number;
  date: string;
  amount: number;
  category: string;
  status: string;
  user_id: string;
  user_profile: string;
};

const data = transactions as Transaction[];

const COLORS = [
  "#00d9ff",
  "#7c4dff",
  "#00e676",
  "#ffb300",
  "#ff4d6d",
];

const categoryTotals: Record<string, number> = {};

data.forEach((transaction) => {
  const category = transaction.category || "Others";
  const amount = Number(transaction.amount) || 0;

  categoryTotals[category] =
    (categoryTotals[category] || 0) + amount;
});

const totalCategoryAmount = Object.values(categoryTotals).reduce(
  (sum, value) => sum + value,
  0
);

const categoryData = Object.entries(categoryTotals)
  .map(([name, value]) => ({
    name,
    value,
    percentage:
      totalCategoryAmount > 0
        ? Math.round((value / totalCategoryAmount) * 100)
        : 0,
  }))
  .sort((a, b) => b.value - a.value)
  .slice(0, 5);

const CategoryBreakdown = () => {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        p: 3,
        borderRadius: "20px",
        background:
          "linear-gradient(145deg, rgba(15,27,52,0.96), rgba(5,10,22,0.98))",
        border: "1px solid rgba(0,217,255,0.14)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.04), 0 15px 40px rgba(0,0,0,0.25)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 1,
        }}
      >
        <PieChartRoundedIcon
          sx={{
            color: "#00d9ff",
            fontSize: 20,
          }}
        />

        <Typography
          sx={{
            color: "#ffffff",
            fontSize: 16,
            fontWeight: 800,
          }}
        >
          Category Breakdown
        </Typography>
      </Box>

      <Typography
        sx={{
          color: "#68758f",
          fontSize: 9,
          letterSpacing: 1.5,
          mb: 2,
        }}
      >
        REAL TRANSACTION DISTRIBUTION
      </Typography>

      {/* Pie Chart */}
      <Box
        sx={{
          width: "100%",
          height: 240,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={88}
              paddingAngle={3}
              stroke="none"
            >
              {categoryData.map((item, index) => (
                <Cell
                  key={item.name}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) =>
                `₹${Number(value).toLocaleString("en-IN")}`
              }
              contentStyle={{
                background: "rgba(7,15,31,0.96)",
                border:
                  "1px solid rgba(0,217,255,0.30)",
                borderRadius: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Center */}
      <Box
        sx={{
          position: "relative",
          mt: -17,
          mb: 12,
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <Typography
          sx={{
            color: "#ffffff",
            fontSize: 22,
            fontWeight: 900,
          }}
        >
          {categoryData.length}
        </Typography>

        <Typography
          sx={{
            color: "#68758f",
            fontSize: 8,
            letterSpacing: 1,
          }}
        >
          CATEGORIES
        </Typography>
      </Box>

      {/* Legend */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1.2,
        }}
      >
        {categoryData.map((item, index) => (
          <Box
            key={item.name}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 1,
              py: 0.8,
              borderRadius: "8px",
              background: "rgba(255,255,255,0.02)",
              border:
                "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.8,
                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  flexShrink: 0,
                  borderRadius: "50%",
                  background:
                    COLORS[index % COLORS.length],
                }}
              />

              <Typography
                sx={{
                  color: "#8793a8",
                  fontSize: 9,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.name}
              </Typography>
            </Box>

            <Typography
              sx={{
                color: "#ffffff",
                fontSize: 9,
                fontWeight: 700,
              }}
            >
              {item.percentage}%
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CategoryBreakdown;