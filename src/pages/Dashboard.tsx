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
  BarChart,
  Bar,
} from "recharts";

import transactions from "../data/transactions.json";

type Transaction = {
  id: number | string;
  date: string;
  amount: number | string;
  category: string;
  status?: string;
  user_id?: string;
  user_profile?: string;
};

const data = transactions as Transaction[];

const money = (value: number) =>
  `₹${Math.round(value).toLocaleString("en-IN")}`;

function Dashboard() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [user, setUser] = useState("All");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] =
    useState<"asc" | "desc">("desc");

  const [page, setPage] = useState(1);
  const [period, setPeriod] = useState<"1M" | "6M" | "1Y">("6M");

  const rowsPerPage = 10;

  /* =========================
     UNIQUE USERS
  ========================= */

  const users = useMemo(() => {
    return Array.from(
      new Set(
        data
          .map((item) => item.user_id)
          .filter(Boolean)
          .map(String)
      )
    );
  }, []);

  /* =========================
     FILTER DATA
  ========================= */

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const amount = Number(item.amount) || 0;

      const text = `
        ${item.id}
        ${item.date}
        ${item.amount}
        ${item.category}
        ${item.status}
        ${item.user_id}
        ${item.user_profile}
      `.toLowerCase();

      if (
        search &&
        !text.includes(search.toLowerCase())
      ) {
        return false;
      }

      if (
        category !== "All" &&
        String(item.category).toLowerCase() !==
          category.toLowerCase()
      ) {
        return false;
      }

      if (
        status !== "All" &&
        String(item.status).toLowerCase() !==
          status.toLowerCase()
      ) {
        return false;
      }

      if (
        user !== "All" &&
        String(item.user_id) !== user
      ) {
        return false;
      }

      if (
        minAmount &&
        amount < Number(minAmount)
      ) {
        return false;
      }

      if (
        maxAmount &&
        amount > Number(maxAmount)
      ) {
        return false;
      }

      if (
        startDate &&
        item.date < startDate
      ) {
        return false;
      }

      if (
        endDate &&
        item.date > endDate
      ) {
        return false;
      }

      return true;
    });
  }, [
    search,
    category,
    status,
    user,
    minAmount,
    maxAmount,
    startDate,
    endDate,
  ]);

  /* =========================
     SORT
  ========================= */

  const sortedData = useMemo(() => {
    const result = [...filteredData];

    result.sort((a, b) => {
      let A: any;
      let B: any;

      if (sortField === "amount") {
        A = Number(a.amount) || 0;
        B = Number(b.amount) || 0;
      } else if (sortField === "date") {
        A = new Date(a.date).getTime();
        B = new Date(b.date).getTime();
      } else {
        A = String(
          a[sortField as keyof Transaction] || ""
        ).toLowerCase();

        B = String(
          b[sortField as keyof Transaction] || ""
        ).toLowerCase();
      }

      if (A < B) {
        return sortDirection === "asc" ? -1 : 1;
      }

      if (A > B) {
        return sortDirection === "asc" ? 1 : -1;
      }

      return 0;
    });

    return result;
  }, [filteredData, sortField, sortDirection]);

  /* =========================
     ANALYTICS
  ========================= */

  const analytics = useMemo(() => {
    let revenue = 0;
    let expenses = 0;
    let paid = 0;
    let pending = 0;

    const uniqueUsers = new Set<string>();

    filteredData.forEach((item) => {
      const amount = Number(item.amount) || 0;

      const cat = String(item.category)
        .trim()
        .toLowerCase();

      const stat = String(item.status)
        .trim()
        .toLowerCase();

      if (cat === "revenue") {
        revenue += amount;
      }

      if (
        cat === "expense" ||
        cat === "expenses"
      ) {
        expenses += amount;
      }

      if (stat === "paid") {
        paid++;
      }

      if (stat === "pending") {
        pending++;
      }

      if (item.user_id) {
        uniqueUsers.add(String(item.user_id));
      }
    });

    const total = revenue + expenses;

    return {
      revenue,
      expenses,
      net: revenue - expenses,
      savings: revenue - expenses,
      transactions: filteredData.length,
      paid,
      pending,
      users: uniqueUsers.size,
      average:
        filteredData.length
          ? total / filteredData.length
          : 0,
    };
  }, [filteredData]);

  /* =========================
     MONTHLY CHART
  ========================= */

  const chartData = useMemo(() => {
    const validDates = data
      .map((item) => new Date(item.date))
      .filter(
        (date) => !isNaN(date.getTime())
      );

    if (!validDates.length) {
      return [];
    }

    const latest = new Date(
      Math.max(
        ...validDates.map((date) =>
          date.getTime()
        )
      )
    );

    const numberOfMonths =
      period === "1M"
        ? 1
        : period === "6M"
        ? 6
        : 12;

    const result = [];

    for (
      let i = numberOfMonths - 1;
      i >= 0;
      i--
    ) {
      const target = new Date(
        latest.getFullYear(),
        latest.getMonth() - i,
        1
      );

      let revenue = 0;
      let expenses = 0;

      data.forEach((item) => {
        const date = new Date(item.date);

        if (
          date.getFullYear() ===
            target.getFullYear() &&
          date.getMonth() ===
            target.getMonth()
        ) {
          const amount =
            Number(item.amount) || 0;

          const cat = String(
            item.category
          ).toLowerCase();

          if (cat === "revenue") {
            revenue += amount;
          }

          if (
            cat === "expense" ||
            cat === "expenses"
          ) {
            expenses += amount;
          }
        }
      });

      result.push({
        month: target.toLocaleString(
          "en-IN",
          { month: "short" }
        ),
        revenue,
        expenses,
      });
    }

    return result;
  }, [period]);

  /* =========================
     CATEGORY CHART
  ========================= */

  const categoryData = [
    {
      name: "Revenue",
      amount: data
        .filter(
          (item) =>
            String(item.category)
              .toLowerCase() === "revenue"
        )
        .reduce(
          (sum, item) =>
            sum +
            (Number(item.amount) || 0),
          0
        ),
    },
    {
      name: "Expenses",
      amount: data
        .filter((item) => {
          const cat =
            String(item.category)
              .toLowerCase();

          return (
            cat === "expense" ||
            cat === "expenses"
          );
        })
        .reduce(
          (sum, item) =>
            sum +
            (Number(item.amount) || 0),
          0
        ),
    },
  ];

  /* =========================
     PAGINATION
  ========================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      sortedData.length / rowsPerPage
    )
  );

  const currentPage = Math.min(
    page,
    totalPages
  );

  const visibleData =
    sortedData.slice(
      (currentPage - 1) *
        rowsPerPage,
      currentPage * rowsPerPage
    );

  /* =========================
     SORT HANDLER
  ========================= */

  const sortBy = (field: string) => {
    if (sortField === field) {
      setSortDirection(
        sortDirection === "asc"
          ? "desc"
          : "asc"
      );
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortIcon = (field: string) => {
    if (sortField !== field) {
      return "↕";
    }

    return sortDirection === "asc"
      ? "↑"
      : "↓";
  };

  /* =========================
     CLEAR FILTERS
  ========================= */

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setStatus("All");
    setUser("All");
    setMinAmount("");
    setMaxAmount("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  /* =========================
     CSV EXPORT
  ========================= */

  const exportCSV = () => {
    const headers = [
      "ID",
      "Date",
      "Amount",
      "Category",
      "Status",
      "User ID",
      "User Profile",
    ];

    const rows = filteredData.map(
      (item) => [
        item.id,
        item.date,
        item.amount,
        item.category,
        item.status || "",
        item.user_id || "",
        item.user_profile || "",
      ]
    );

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map(
            (value) =>
              `"${String(value).replace(
                /"/g,
                '""'
              )}"`
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "FINX_Financial_Report.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    window.dispatchEvent(
      new Event("finx-export-success")
    );
  };

  /* =========================
     STYLES
  ========================= */

  const panel: React.CSSProperties = {
    background:
      "linear-gradient(145deg,#0a2033,#061321)",
    border: "1px solid #173a52",
    borderRadius: "16px",
    boxShadow:
      "0 15px 40px rgba(0,0,0,.25)",
  };

  const input: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 12px",
    borderRadius: "8px",
    border: "1px solid #21445c",
    background: "#061522",
    color: "#e2e8f0",
    outline: "none",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top right,#12324a,#061321 40%,#020812)",
        color: "#fff",
        fontFamily:
          "Inter,Segoe UI,Arial,sans-serif",
      }}
    >
      {/* HEADER */}

      <header
        style={{
          height: "72px",
          padding: "0 30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background:
            "rgba(3,14,25,.95)",
          borderBottom:
            "1px solid #17364b",
          position: "sticky",
          top: 0,
          zIndex: 20,
          backdropFilter: "blur(12px)",
        }}
      >
        <div>
          <div
            style={{
              color: "#67e8f9",
              fontSize: "25px",
              fontWeight: 900,
              letterSpacing: "3px",
            }}
          >
            FINX
          </div>

          <div
            style={{
              color: "#5d758b",
              fontSize: "9px",
              letterSpacing: "1.5px",
            }}
          >
            FINANCIAL ANALYTICS PLATFORM
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span
            style={{
              padding:
                "7px 13px",
              borderRadius: "20px",
              color: "#4ade80",
              background: "#09251f",
              border:
                "1px solid #145c48",
              fontSize: "10px",
              fontWeight: 800,
            }}
          >
            ● DATA LIVE
          </span>

          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg,#06b6d4,#7c3aed)",
              fontWeight: 900,
              fontSize: "12px",
            }}
          >
            AD
          </div>
        </div>
      </header>

      <main
        style={{
          maxWidth: "1600px",
          margin: "auto",
          padding: "30px",
        }}
      >
        {/* TITLE */}

        <div style={{ marginBottom: "24px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              fontWeight: 850,
            }}
          >
            Financial Control Center
          </h1>

          <p
            style={{
              color: "#6e879c",
              marginTop: "7px",
              fontSize: "13px",
            }}
          >
            Complete overview of your financial
            transaction data
          </p>
        </div>

        {/* KPI CARDS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(190px,1fr))",
            gap: "15px",
            marginBottom: "22px",
          }}
        >
          {[
            [
              "TOTAL REVENUE",
              money(analytics.revenue),
              "#22d3ee",
            ],
            [
              "TOTAL EXPENSES",
              money(analytics.expenses),
              "#fb7185",
            ],
            [
              "NET BALANCE",
              money(analytics.net),
              "#a78bfa",
            ],
            [
              "SAVINGS",
              money(analytics.savings),
              "#4ade80",
            ],
            [
              "TRANSACTIONS",
              analytics.transactions,
              "#fbbf24",
            ],
            [
              "PAID",
              analytics.paid,
              "#34d399",
            ],
            [
              "PENDING",
              analytics.pending,
              "#fb923c",
            ],
            [
              "USERS",
              analytics.users,
              "#38bdf8",
            ],
          ].map(
            ([title, value, accent]) => (
              <div
                key={String(title)}
                style={{
                  ...panel,
                  padding: "19px",
                  borderTop:
                    `2px solid ${accent}`,
                }}
              >
                <div
                  style={{
                    color: "#698298",
                    fontSize: "10px",
                    fontWeight: 800,
                    letterSpacing:
                      "1px",
                  }}
                >
                  {title}
                </div>

                <div
                  style={{
                    marginTop: "12px",
                    fontSize: "23px",
                    fontWeight: 850,
                  }}
                >
                  {String(value)}
                </div>
              </div>
            )
          )}
        </div>

        {/* CHARTS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(0,2fr) minmax(300px,1fr)",
            gap: "20px",
            marginBottom: "22px",
          }}
        >
          <section
            style={{
              ...panel,
              padding: "22px",
              minHeight: "410px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "17px",
                  }}
                >
                  Revenue vs Expenses
                </h2>

                <div
                  style={{
                    color: "#60758b",
                    fontSize: "11px",
                    marginTop: "5px",
                  }}
                >
                  Monthly financial movement
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "4px",
                  padding: "3px",
                  background:
                    "#061522",
                  border:
                    "1px solid #173a52",
                  borderRadius: "8px",
                }}
              >
                {(
                  ["1M", "6M", "1Y"] as const
                ).map((item) => (
                  <button
                    key={item}
                    onClick={() =>
                      setPeriod(item)
                    }
                    style={{
                      border: 0,
                      borderRadius: "5px",
                      padding:
                        "7px 11px",
                      cursor: "pointer",
                      background:
                        period === item
                          ? "#073c54"
                          : "transparent",
                      color:
                        period === item
                          ? "#67e8f9"
                          : "#64748b",
                      fontWeight: 800,
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <ResponsiveContainer
              width="100%"
              height={330}
            >
              <LineChart
                data={chartData}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#172b3d"
                />

                <XAxis
                  dataKey="month"
                  tick={{
                    fill: "#64748b",
                    fontSize: 11,
                  }}
                />

                <YAxis
                  tick={{
                    fill: "#64748b",
                    fontSize: 10,
                  }}
                  tickFormatter={(value) =>
                    `₹${Number(
                      value
                    ).toLocaleString(
                      "en-IN"
                    )}`
                  }
                />

                <Tooltip
                  contentStyle={{
                    background:
                      "#071827",
                    border:
                      "1px solid #24506a",
                    borderRadius:
                      "10px",
                  }}
                  formatter={(
                    value: any,
                    name: any
                  ) => [
                    money(
                      Number(
                        value || 0
                      )
                    ),
                    name ===
                    "revenue"
                      ? "Revenue"
                      : "Expenses",
                  ]}
                />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#22d3ee"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  name="Revenue"
                />

                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#fb7185"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  name="Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          </section>

          <section
            style={{
              ...panel,
              padding: "22px",
              minHeight: "410px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "17px",
              }}
            >
              Category Breakdown
            </h2>

            <div
              style={{
                color: "#60758b",
                fontSize: "11px",
                marginTop: "5px",
                marginBottom: "20px",
              }}
            >
              Complete revenue and expense distribution
            </div>

            <ResponsiveContainer
              width="100%"
              height={330}
            >
              <BarChart
                data={categoryData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#172b3d"
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fill: "#64748b",
                    fontSize: 11,
                  }}
                />

                <YAxis
                  tick={{
                    fill: "#64748b",
                    fontSize: 10,
                  }}
                />

                <Tooltip
                  formatter={(value: any) =>
                    money(
                      Number(value || 0)
                    )
                  }
                />

                <Bar
                  dataKey="amount"
                  fill="#22d3ee"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </section>
        </div>

        {/* FILTER PANEL */}

        <section
          style={{
            ...panel,
            padding: "22px",
            marginBottom: "22px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: "18px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "17px",
                }}
              >
                Select & Filter Data
              </h2>

              <div
                style={{
                  color: "#60758b",
                  fontSize: "11px",
                  marginTop: "5px",
                }}
              >
                Narrow the financial dataset
                using multiple conditions
              </div>
            </div>

            <button
              onClick={clearFilters}
              style={{
                padding:
                  "9px 15px",
                borderRadius: "8px",
                border:
                  "1px solid #713047",
                background:
                  "#260f1b",
                color: "#fb7185",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              CLEAR FILTERS
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(170px,1fr))",
              gap: "12px",
            }}
          >
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="🔎 Search transactions..."
              style={{
                ...input,
                gridColumn:
                  "span 2",
              }}
            />

            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              style={input}
            >
              <option value="All">
                All Categories
              </option>
              <option value="Revenue">
                Revenue
              </option>
              <option value="Expense">
                Expense
              </option>
            </select>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              style={input}
            >
              <option value="All">
                All Status
              </option>
              <option value="Paid">
                Paid
              </option>
              <option value="Pending">
                Pending
              </option>
            </select>

            <select
              value={user}
              onChange={(e) => {
                setUser(e.target.value);
                setPage(1);
              }}
              style={input}
            >
              <option value="All">
                All Users
              </option>

              {users.map(
                (userId) => (
                  <option
                    key={userId}
                    value={userId}
                  >
                    {userId}
                  </option>
                )
              )}
            </select>

            <input
              type="number"
              value={minAmount}
              onChange={(e) => {
                setMinAmount(
                  e.target.value
                );
                setPage(1);
              }}
              placeholder="Min amount"
              style={input}
            />

            <input
              type="number"
              value={maxAmount}
              onChange={(e) => {
                setMaxAmount(
                  e.target.value
                );
                setPage(1);
              }}
              placeholder="Max amount"
              style={input}
            />

            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(
                  e.target.value
                );
                setPage(1);
              }}
              style={input}
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(
                  e.target.value
                );
                setPage(1);
              }}
              style={input}
            />
          </div>

          <div
            style={{
              marginTop: "15px",
              color: "#67e8f9",
              fontSize: "11px",
              fontWeight: 700,
            }}
          >
            SHOWING{" "}
            {filteredData.length} OF{" "}
            {data.length} TRANSACTIONS
          </div>
        </section>

        {/* TRANSACTIONS */}

        <section
          style={{
            ...panel,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "20px 22px",
              borderBottom:
                "1px solid #17364b",
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "17px",
                }}
              >
                Transaction Intelligence
              </h2>

              <div
                style={{
                  color: "#60758b",
                  fontSize: "11px",
                  marginTop: "5px",
                }}
              >
                {filteredData.length} matching
                financial records
              </div>
            </div>

            <button
              onClick={exportCSV}
              style={{
                padding:
                  "10px 17px",
                borderRadius: "8px",
                border:
                  "1px solid #126276",
                background:
                  "#073344",
                color: "#67e8f9",
                cursor: "pointer",
                fontWeight: 800,
                fontSize: "11px",
              }}
            >
              ↓ EXPORT CSV
            </button>
          </div>

          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
                minWidth: "900px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background:
                      "#071827",
                  }}
                >
                  {[
                    ["id", "ID"],
                    ["date", "DATE"],
                    [
                      "user_id",
                      "USER",
                    ],
                    [
                      "category",
                      "CATEGORY",
                    ],
                    [
                      "status",
                      "STATUS",
                    ],
                    [
                      "amount",
                      "AMOUNT",
                    ],
                  ].map(
                    ([field, label]) => (
                      <th
                        key={field}
                        onClick={() =>
                          sortBy(field)
                        }
                        style={{
                          textAlign:
                            "left",
                          padding:
                            "14px 16px",
                          color:
                            "#6f879b",
                          fontSize:
                            "10px",
                          letterSpacing:
                            "1px",
                          cursor:
                            "pointer",
                          borderBottom:
                            "1px solid #17364b",
                        }}
                      >
                        {label}{" "}
                        <span
                          style={{
                            color:
                              "#22d3ee",
                          }}
                        >
                          {sortIcon(
                            field
                          )}
                        </span>
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {visibleData.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        padding:
                          "40px",
                        textAlign:
                          "center",
                        color:
                          "#64748b",
                      }}
                    >
                      No transactions
                      found for the
                      selected filters.
                    </td>
                  </tr>
                ) : (
                  visibleData.map(
                    (item) => (
                      <tr
                        key={String(
                          item.id
                        )}
                        style={{
                          borderBottom:
                            "1px solid #102a3d",
                        }}
                      >
                        <td
                          style={{
                            padding:
                              "13px 16px",
                            color:
                              "#94a3b8",
                            fontSize:
                              "12px",
                          }}
                        >
                          {item.id}
                        </td>

                        <td
                          style={{
                            padding:
                              "13px 16px",
                            color:
                              "#cbd5e1",
                            fontSize:
                              "12px",
                          }}
                        >
                          {item.date}
                        </td>

                        <td
                          style={{
                            padding:
                              "13px 16px",
                            color:
                              "#67e8f9",
                            fontSize:
                              "12px",
                          }}
                        >
                          {item.user_id ||
                            "-"}
                        </td>

                        <td
                          style={{
                            padding:
                              "13px 16px",
                            fontSize:
                              "12px",
                          }}
                        >
                          <span
                            style={{
                              padding:
                                "5px 9px",
                              borderRadius:
                                "20px",
                              background:
                                String(
                                  item.category
                                ).toLowerCase() ===
                                "revenue"
                                  ? "#062d35"
                                  : "#32111e",
                              color:
                                String(
                                  item.category
                                ).toLowerCase() ===
                                "revenue"
                                  ? "#22d3ee"
                                  : "#fb7185",
                              fontWeight:
                                700,
                            }}
                          >
                            {
                              item.category
                            }
                          </span>
                        </td>

                        <td
                          style={{
                            padding:
                              "13px 16px",
                            fontSize:
                              "12px",
                          }}
                        >
                          <span
                            style={{
                              color:
                                String(
                                  item.status
                                ).toLowerCase() ===
                                "paid"
                                  ? "#4ade80"
                                  : "#fbbf24",
                              fontWeight:
                                700,
                            }}
                          >
                            ●{" "}
                            {item.status ||
                              "-"}
                          </span>
                        </td>

                        <td
                          style={{
                            padding:
                              "13px 16px",
                            color:
                              "#f8fafc",
                            fontWeight:
                              800,
                            fontSize:
                              "12px",
                          }}
                        >
                          {money(
                            Number(
                              item.amount
                            ) || 0
                          )}
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}

          <div
            style={{
              padding:
                "15px 20px",
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              borderTop:
                "1px solid #17364b",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <span
              style={{
                color: "#60758b",
                fontSize: "11px",
              }}
            >
              PAGE {currentPage} OF{" "}
              {totalPages}
            </span>

            <div
              style={{
                display: "flex",
                gap: "6px",
              }}
            >
              <button
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  setPage(
                    currentPage - 1
                  )
                }
                style={{
                  padding:
                    "8px 14px",
                  borderRadius: "7px",
                  border:
                    "1px solid #21445c",
                  background:
                    "#071827",
                  color: "#94a3b8",
                  cursor:
                    currentPage ===
                    1
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                ←
              </button>

              <button
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setPage(
                    currentPage + 1
                  )
                }
                style={{
                  padding:
                    "8px 14px",
                  borderRadius: "7px",
                  border:
                    "1px solid #21445c",
                  background:
                    "#071827",
                  color: "#94a3b8",
                  cursor:
                    currentPage ===
                    totalPages
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                →
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER */}

        <div
          style={{
            marginTop: "25px",
            padding:
              "15px 0",
            borderTop:
              "1px solid #10283b",
            display: "flex",
            justifyContent:
              "space-between",
            color: "#40586d",
            fontSize: "10px",
          }}
        >
          <span>
            FINX • FINANCIAL ANALYTICS
          </span>

          <span>
            ● SYSTEM ONLINE
          </span>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;