import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import transactions from "../../data/transactions.json";

type Transaction = {
  id: number | string;
  date: string;
  amount: number | string;
  category: string;
  status?: string;
  user_id?: string;
  user_profile?: string;
};

type ChartData = {
  key: string;
  month: string;
  revenue: number;
  expenses: number;
};

function RevenueExpenseChart() {
  const [period, setPeriod] = useState<"1M" | "6M" | "1Y">("6M");

  const chartData = useMemo<ChartData[]>(() => {
    const data = transactions as Transaction[];

    if (!data || data.length === 0) {
      return [];
    }

    // Find the latest valid transaction date
    const validDates = data
      .map((transaction) => new Date(transaction.date))
      .filter((date) => !isNaN(date.getTime()));

    if (validDates.length === 0) {
      return [];
    }

    const latestDate = new Date(
      Math.max(...validDates.map((date) => date.getTime()))
    );

    let monthsToShow = 6;

    if (period === "1M") {
      monthsToShow = 1;
    }

    if (period === "6M") {
      monthsToShow = 6;
    }

    if (period === "1Y") {
      monthsToShow = 12;
    }

    // Create monthly buckets
    const months: ChartData[] = [];

    for (let i = monthsToShow - 1; i >= 0; i--) {
      const date = new Date(
        latestDate.getFullYear(),
        latestDate.getMonth() - i,
        1
      );

      const year = date.getFullYear();
      const monthNumber = date.getMonth();

      const key = `${year}-${String(monthNumber + 1).padStart(2, "0")}`;

      months.push({
        key,
        month: date.toLocaleString("en-IN", {
          month: "short",
        }),
        revenue: 0,
        expenses: 0,
      });
    }

    // Add transactions to the correct month
    data.forEach((transaction) => {
      if (!transaction.date) {
        return;
      }

      const transactionDate = new Date(transaction.date);

      if (isNaN(transactionDate.getTime())) {
        return;
      }

      const year = transactionDate.getFullYear();
      const monthNumber = transactionDate.getMonth();

      const key = `${year}-${String(monthNumber + 1).padStart(2, "0")}`;

      const monthData = months.find((item) => item.key === key);

      if (!monthData) {
        return;
      }

      const amount = Number(transaction.amount) || 0;

      const category = String(transaction.category)
        .trim()
        .toLowerCase();

      if (category === "revenue") {
        monthData.revenue += amount;
      }

      if (category === "expense" || category === "expenses") {
        monthData.expenses += amount;
      }
    });

    return months;
  }, [period]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: "420px",
      }}
    >
      {/* Period selector */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "15px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "4px",
            background: "#071426",
            border: "1px solid #12304a",
            borderRadius: "8px",
            padding: "3px",
          }}
        >
          {(["1M", "6M", "1Y"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setPeriod(item)}
              style={{
                padding: "8px 14px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                background:
                  period === item ? "#063c55" : "transparent",
                color:
                  period === item ? "#00e5ff" : "#64748b",
                fontWeight: 700,
                fontSize: "12px",
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={chartData}
          margin={{
            top: 10,
            right: 20,
            left: 10,
            bottom: 10,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#17243a"
          />

          <XAxis
            dataKey="month"
            tick={{
              fill: "#64748b",
              fontSize: 11,
            }}
            axisLine={{
              stroke: "#17243a",
            }}
          />

          <YAxis
            tick={{
              fill: "#64748b",
              fontSize: 11,
            }}
            axisLine={{
              stroke: "#17243a",
            }}
            tickFormatter={(value) =>
              `₹${Number(value).toLocaleString("en-IN")}`
            }
          />

          <Tooltip
            contentStyle={{
              background: "#071426",
              border: "1px solid #164e63",
              borderRadius: "10px",
              color: "#ffffff",
            }}
            formatter={(value: any, name: any) => [
              `₹${Number(value || 0).toLocaleString("en-IN")}`,
              name === "revenue" ? "Revenue" : "Expenses",
            ]}
          />

          <Legend
            wrapperStyle={{
              color: "#94a3b8",
              fontSize: "12px",
            }}
          />

          <Line
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#00e5ff"
            strokeWidth={3}
            dot={{
              r: 4,
              fill: "#00e5ff",
            }}
            activeDot={{
              r: 6,
            }}
          />

          <Line
            type="monotone"
            dataKey="expenses"
            name="Expenses"
            stroke="#ff3d71"
            strokeWidth={3}
            dot={{
              r: 4,
              fill: "#ff3d71",
            }}
            activeDot={{
              r: 6,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueExpenseChart;