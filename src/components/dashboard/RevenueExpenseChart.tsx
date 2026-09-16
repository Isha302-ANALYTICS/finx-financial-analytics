import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { useMemo, useState } from "react";

import transactions from "../../data/transactions.json";

type Period = "1M" | "6M" | "1Y";

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

const getMonthKey = (date: string) => {
  const parsedDate = new Date(date);

  return `${parsedDate.getFullYear()}-${String(
    parsedDate.getMonth() + 1
  ).padStart(2, "0")}`;
};

const getMonthLabel = (monthKey: string) => {
  const [year, month] = monthKey.split("-");

  return new Date(
    Number(year),
    Number(month) - 1,
    1
  ).toLocaleString("en-IN", {
    month: "short",
  });
};

const RevenueExpenseChart = () => {
  const [period, setPeriod] = useState<Period>("6M");

  const chartData = useMemo(() => {
    const monthlyData: Record<
      string,
      { revenue: number; expenses: number }
    > = {};

    data.forEach((transaction) => {
      const monthKey = getMonthKey(transaction.date);

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          revenue: 0,
          expenses: 0,
        };
      }

      const amount = Number(transaction.amount) || 0;

      if (
        transaction.status.toLowerCase() === "completed"
      ) {
        monthlyData[monthKey].revenue += amount;
      } else {
        monthlyData[monthKey].expenses += amount;
      }
    });

    const sortedMonths = Object.keys(monthlyData).sort();

    let selectedMonths: string[];

    if (period === "1M") {
      selectedMonths = sortedMonths.slice(-1);
    } else if (period === "6M") {
      selectedMonths = sortedMonths.slice(-6);
    } else {
      selectedMonths = sortedMonths.slice(-12);
    }

    return selectedMonths.map((monthKey) => ({
      month: getMonthLabel(monthKey),
      revenue: Math.round(monthlyData[monthKey].revenue),
      expenses: Math.round(monthlyData[monthKey].expenses),
    }));
  }, [period]);

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#00d9ff",
                boxShadow: "0 0 12px #00d9ff",
              }}
            />

            <Typography
              sx={{
                color: "#ffffff",
                fontSize: 16,
                fontWeight: 800,
              }}
            >
              Revenue vs Expenses
            </Typography>
          </Box>

          <Typography
            sx={{
              color: "#68758f",
              fontSize: 9,
              mt: 0.7,
              letterSpacing: 1.5,
            }}
          >
            REAL TRANSACTION DATA
          </Typography>
        </Box>

        <ToggleButtonGroup
          value={period}
          exclusive
          onChange={(_, value: Period | null) => {
            if (value) {
              setPeriod(value);
            }
          }}
          size="small"
          sx={{
            "& .MuiToggleButton-root": {
              color: "#66758f",
              borderColor: "rgba(0,217,255,0.12)",
              fontSize: 9,
              fontWeight: 800,
              minWidth: 42,

              "&.Mui-selected": {
                color: "#00d9ff",
                background: "rgba(0,217,255,0.10)",
              },
            },
          }}
        >
          <ToggleButton value="1M">1M</ToggleButton>
          <ToggleButton value="6M">6M</ToggleButton>
          <ToggleButton value="1Y">1Y</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box
        sx={{
          width: "100%",
          height: 350,
        }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="revenueGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#00d9ff"
                  stopOpacity={0.38}
                />
                <stop
                  offset="100%"
                  stopColor="#00d9ff"
                  stopOpacity={0}
                />
              </linearGradient>

              <linearGradient
                id="expenseGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#ff4d6d"
                  stopOpacity={0.28}
                />
                <stop
                  offset="100%"
                  stopColor="#ff4d6d"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#68758f",
                fontSize: 10,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#68758f",
                fontSize: 10,
              }}
              tickFormatter={(value: number) =>
                `₹${(value / 1000).toFixed(0)}K`
              }
            />

            <Tooltip
              contentStyle={{
                background: "rgba(7,15,31,0.96)",
                border:
                  "1px solid rgba(0,217,255,0.30)",
                borderRadius: "12px",
              }}
              formatter={(value) =>
                `₹${Number(value).toLocaleString("en-IN")}`
              }
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#00d9ff"
              strokeWidth={3}
              fill="url(#revenueGradient)"
              dot={false}
            />

            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#ff4d6d"
              strokeWidth={2}
              fill="url(#expenseGradient)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          mt: 1,
        }}
      >
        <Typography
          sx={{
            color: "#00d9ff",
            fontSize: 10,
          }}
        >
          ● Revenue
        </Typography>

        <Typography
          sx={{
            color: "#ff4d6d",
            fontSize: 10,
          }}
        >
          ● Expenses
        </Typography>
      </Box>
    </Box>
  );
};

export default RevenueExpenseChart;