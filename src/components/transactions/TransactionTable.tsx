import { useMemo, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";

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

type SortKey =
  | "id"
  | "date"
  | "amount"
  | "category"
  | "status"
  | "user_id";

type SortDirection = "asc" | "desc";

const data = transactions as Transaction[];

const TransactionTable = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [userFilter, setUserFilter] = useState("All");

  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(data.map((item) => item.category))
      ),
    ],
    []
  );

  const statuses = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(data.map((item) => item.status))
      ),
    ],
    []
  );

  const users = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(data.map((item) => item.user_id))
      ),
    ],
    []
  );

  const filteredData = useMemo(() => {
    const searchValue = search.toLowerCase();

    const min =
      minAmount === "" ? null : Number(minAmount);

    const max =
      maxAmount === "" ? null : Number(maxAmount);

    const result = data.filter((transaction) => {
      const matchesSearch = Object.values(transaction).some(
        (value) =>
          String(value)
            .toLowerCase()
            .includes(searchValue)
      );

      const matchesCategory =
        categoryFilter === "All" ||
        transaction.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" ||
        transaction.status === statusFilter;

      const matchesUser =
        userFilter === "All" ||
        transaction.user_id === userFilter;

      const transactionAmount = Number(
        transaction.amount
      );

      const matchesMinAmount =
        min === null ||
        transactionAmount >= min;

      const matchesMaxAmount =
        max === null ||
        transactionAmount <= max;

      const matchesDate =
        dateFilter === "" ||
        transaction.date.startsWith(dateFilter);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesUser &&
        matchesMinAmount &&
        matchesMaxAmount &&
        matchesDate
      );
    });

    result.sort((a, b) => {
      let comparison = 0;

      if (sortKey === "amount") {
        comparison =
          Number(a.amount) - Number(b.amount);
      } else if (sortKey === "id") {
        comparison = a.id - b.id;
      } else if (sortKey === "date") {
        comparison =
          new Date(a.date).getTime() -
          new Date(b.date).getTime();
      } else {
        comparison = String(a[sortKey]).localeCompare(
          String(b[sortKey])
        );
      }

      return sortDirection === "asc"
        ? comparison
        : -comparison;
    });

    return result;
  }, [
    search,
    categoryFilter,
    statusFilter,
    userFilter,
    minAmount,
    maxAmount,
    dateFilter,
    sortKey,
    sortDirection,
  ]);

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((current) =>
        current === "asc" ? "desc" : "asc"
      );
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }

    setPage(0);
  };

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) {
      return null;
    }

    return sortDirection === "asc" ? (
      <ArrowUpwardRoundedIcon
        sx={{
          fontSize: 13,
          color: "#00d9ff",
          ml: 0.5,
        }}
      />
    ) : (
      <ArrowDownwardRoundedIcon
        sx={{
          fontSize: 13,
          color: "#00d9ff",
          ml: 0.5,
        }}
      />
    );
  };

  const handleCategoryChange = (
    event: { target: { value: string } }
  ) => {
    setCategoryFilter(event.target.value);
    setPage(0);
  };

  const handleStatusChange = (
    event: { target: { value: string } }
  ) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleUserChange = (
    event: { target: { value: string } }
  ) => {
    setUserFilter(event.target.value);
    setPage(0);
  };

  return (
    <Box
      sx={{
        mt: 3,
        p: 3,
        borderRadius: "20px",
        background:
          "linear-gradient(145deg, rgba(15,27,52,0.96), rgba(5,10,22,0.98))",
        border:
          "1px solid rgba(0,217,255,0.14)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.04), 0 15px 40px rgba(0,0,0,0.25)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "#ffffff",
              fontSize: 17,
              fontWeight: 800,
            }}
          >
            Transactions
          </Typography>

          <Typography
            sx={{
              color: "#68758f",
              fontSize: 9,
              letterSpacing: 1.5,
              mt: 0.5,
            }}
          >
            LIVE TRANSACTION DATA
          </Typography>
        </Box>

        <TextField
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
          }}
          placeholder="Search transactions..."
          size="small"
          sx={{
            width: 280,
            "& .MuiOutlinedInput-root": {
              color: "#ffffff",
              borderRadius: "10px",
              background:
                "rgba(255,255,255,0.03)",
              "& fieldset": {
                borderColor:
                  "rgba(0,217,255,0.18)",
              },
              "&:hover fieldset": {
                borderColor:
                  "rgba(0,217,255,0.4)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#00d9ff",
              },
            },
            "& input::placeholder": {
              color: "#68758f",
              opacity: 1,
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon
                    sx={{
                      color: "#00d9ff",
                      fontSize: 19,
                    }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(5, 1fr)",
          },
          gap: 1.5,
          mb: 2.5,
        }}
      >
        <FormControl size="small">
          <InputLabel sx={{ color: "#68758f" }}>
            Category
          </InputLabel>

          <Select
            value={categoryFilter}
            label="Category"
            onChange={handleCategoryChange}
            sx={{
              color: "#ffffff",
              borderRadius: "10px",
              "& fieldset": {
                borderColor:
                  "rgba(0,217,255,0.18)",
              },
              "& .MuiSvgIcon-root": {
                color: "#00d9ff",
              },
            }}
          >
            {categories.map((category) => (
              <MenuItem
                key={category}
                value={category}
              >
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel sx={{ color: "#68758f" }}>
            Status
          </InputLabel>

          <Select
            value={statusFilter}
            label="Status"
            onChange={handleStatusChange}
            sx={{
              color: "#ffffff",
              borderRadius: "10px",
              "& fieldset": {
                borderColor:
                  "rgba(0,217,255,0.18)",
              },
              "& .MuiSvgIcon-root": {
                color: "#00d9ff",
              },
            }}
          >
            {statuses.map((status) => (
              <MenuItem
                key={status}
                value={status}
              >
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel sx={{ color: "#68758f" }}>
            User
          </InputLabel>

          <Select
            value={userFilter}
            label="User"
            onChange={handleUserChange}
            sx={{
              color: "#ffffff",
              borderRadius: "10px",
              "& fieldset": {
                borderColor:
                  "rgba(0,217,255,0.18)",
              },
              "& .MuiSvgIcon-root": {
                color: "#00d9ff",
              },
            }}
          >
            {users.map((user) => (
              <MenuItem
                key={user}
                value={user}
              >
                {user}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Min Amount"
          type="number"
          size="small"
          value={minAmount}
          onChange={(event) => {
            setMinAmount(event.target.value);
            setPage(0);
          }}
          sx={{
            "& .MuiInputBase-input": {
              color: "#ffffff",
            },
            "& label": {
              color: "#68758f",
            },
            "& fieldset": {
              borderColor:
                "rgba(0,217,255,0.18)",
            },
          }}
        />

        <TextField
          label="Max Amount"
          type="number"
          size="small"
          value={maxAmount}
          onChange={(event) => {
            setMaxAmount(event.target.value);
            setPage(0);
          }}
          sx={{
            "& .MuiInputBase-input": {
              color: "#ffffff",
            },
            "& label": {
              color: "#68758f",
            },
            "& fieldset": {
              borderColor:
                "rgba(0,217,255,0.18)",
            },
          }}
        />

        <TextField
          label="Date"
          type="date"
          size="small"
          value={dateFilter}
          onChange={(event) => {
            setDateFilter(event.target.value);
            setPage(0);
          }}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          sx={{
            "& .MuiInputBase-input": {
              color: "#ffffff",
            },
            "& label": {
              color: "#68758f",
            },
            "& fieldset": {
              borderColor:
                "rgba(0,217,255,0.18)",
            },
          }}
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          background: "transparent",
          boxShadow: "none",
          overflowX: "auto",
        }}
      >
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              {[
                ["ID", "id"],
                ["DATE", "date"],
                ["AMOUNT", "amount"],
                ["CATEGORY", "category"],
                ["STATUS", "status"],
                ["USER ID", "user_id"],
              ].map(([heading, key]) => (
                <TableCell
                  key={heading}
                  onClick={() =>
                    handleSort(key as SortKey)
                  }
                  sx={{
                    color: "#68758f",
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: 1,
                    borderBottom:
                      "1px solid rgba(255,255,255,0.08)",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    "&:hover": {
                      color: "#00d9ff",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {heading}
                    {renderSortIcon(
                      key as SortKey
                    )}
                  </Box>
                </TableCell>
              ))}

              <TableCell
                sx={{
                  color: "#68758f",
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: 1,
                  borderBottom:
                    "1px solid rgba(255,255,255,0.08)",
                }}
              >
                PROFILE
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map((transaction) => (
              <TableRow
                key={transaction.id}
                sx={{
                  "&:hover": {
                    background:
                      "rgba(0,217,255,0.04)",
                  },
                }}
              >
                <TableCell
                  sx={{
                    color: "#8793a8",
                    fontSize: 12,
                  }}
                >
                  #{transaction.id}
                </TableCell>

                <TableCell
                  sx={{
                    color: "#ffffff",
                    fontSize: 12,
                  }}
                >
                  {new Date(
                    transaction.date
                  ).toLocaleDateString("en-IN")}
                </TableCell>

                <TableCell
                  sx={{
                    color: "#00d9ff",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {formatCurrency(
                    Number(transaction.amount)
                  )}
                </TableCell>

                <TableCell
                  sx={{
                    color: "#ffffff",
                    fontSize: 12,
                  }}
                >
                  {transaction.category}
                </TableCell>

                <TableCell>
                  <Box
                    sx={{
                      display: "inline-block",
                      px: 1.2,
                      py: 0.5,
                      borderRadius: "20px",
                      background:
                        transaction.status.toLowerCase() ===
                        "paid"
                          ? "rgba(0,230,118,0.10)"
                          : "rgba(255,179,0,0.10)",
                      color:
                        transaction.status.toLowerCase() ===
                        "paid"
                          ? "#00e676"
                          : "#ffb300",
                      fontSize: 9,
                      fontWeight: 800,
                    }}
                  >
                    {transaction.status}
                  </Box>
                </TableCell>

                <TableCell
                  sx={{
                    color: "#8793a8",
                    fontSize: 11,
                  }}
                >
                  {transaction.user_id}
                </TableCell>

                <TableCell
                  sx={{
                    color: "#8793a8",
                    fontSize: 11,
                  }}
                >
                  {transaction.user_profile}
                </TableCell>
              </TableRow>
            ))}

            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                  sx={{
                    color: "#68758f",
                    py: 5,
                    borderBottom: "none",
                  }}
                >
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={(_, newPage) =>
          setPage(newPage)
        }
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(
            Number(event.target.value)
          );
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
        sx={{
          color: "#8793a8",
          "& .MuiTablePagination-selectIcon": {
            color: "#00d9ff",
          },
          "& .MuiTablePagination-actions button": {
            color: "#00d9ff",
          },
        }}
      />
    </Box>
  );
};

export default TransactionTable;