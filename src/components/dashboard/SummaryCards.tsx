import { Box, Typography } from "@mui/material";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import SavingsRoundedIcon from "@mui/icons-material/SavingsRounded";

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

const totalRevenue = data
  .filter(
    (transaction) =>
      transaction.category.toLowerCase() === "revenue"
  )
  .reduce(
    (sum, transaction) =>
      sum + Number(transaction.amount || 0),
    0
  );

const totalExpenses = data
  .filter(
    (transaction) =>
      transaction.category.toLowerCase() === "expense"
  )
  .reduce(
    (sum, transaction) =>
      sum + Number(transaction.amount || 0),
    0
  );

const netBalance = totalRevenue - totalExpenses;

const savings = netBalance > 0 ? netBalance : 0;

const formatCurrency = (value: number) =>
  `₹${value.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;

const cards = [
  {
    title: "TOTAL REVENUE",
    value: formatCurrency(totalRevenue),
    subtitle: "All revenue transactions",
    icon: TrendingUpRoundedIcon,
    iconColor: "#00e676",
    glow: "rgba(0,230,118,0.18)",
  },
  {
    title: "TOTAL EXPENSES",
    value: formatCurrency(totalExpenses),
    subtitle: "All expense transactions",
    icon: TrendingDownRoundedIcon,
    iconColor: "#ff4d6d",
    glow: "rgba(255,77,109,0.18)",
  },
  {
    title: "NET BALANCE",
    value: formatCurrency(netBalance),
    subtitle: "Revenue minus expenses",
    icon: AccountBalanceWalletRoundedIcon,
    iconColor: "#00d9ff",
    glow: "rgba(0,217,255,0.18)",
  },
  {
    title: "SAVINGS",
    value: formatCurrency(savings),
    subtitle: "Positive net balance",
    icon: SavingsRoundedIcon,
    iconColor: "#b56cff",
    glow: "rgba(181,108,255,0.18)",
  },
];

const SummaryCards = () => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        gap: 2,
        mb: 3,
      }}
    >
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Box
            key={card.title}
            sx={{
              position: "relative",
              overflow: "hidden",
              p: 2.5,
              minHeight: 145,
              borderRadius: "18px",
              background:
                "linear-gradient(145deg, rgba(15,27,52,0.96), rgba(5,10,22,0.98))",
              border: "1px solid rgba(0,217,255,0.12)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.04), 0 15px 40px rgba(0,0,0,0.22)",
              transition: "all 0.25s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                borderColor: "rgba(0,217,255,0.35)",
                boxShadow:
                  "0 15px 45px rgba(0,217,255,0.10)",
              },
            }}
          >
            {/* Glow */}
            <Box
              sx={{
                position: "absolute",
                width: 110,
                height: 110,
                right: -35,
                top: -35,
                borderRadius: "50%",
                background: card.glow,
                filter: "blur(35px)",
                pointerEvents: "none",
              }}
            />

            {/* Icon */}
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `${card.glow}`,
                border: `1px solid ${card.iconColor}30`,
                mb: 2,
              }}
            >
              <Icon
                sx={{
                  color: card.iconColor,
                  fontSize: 22,
                }}
              />
            </Box>

            {/* Title */}
            <Typography
              sx={{
                color: "#68758f",
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: 1.4,
                mb: 0.6,
              }}
            >
              {card.title}
            </Typography>

            {/* Value */}
            <Typography
              sx={{
                color: "#ffffff",
                fontSize: {
                  xs: 22,
                  sm: 24,
                },
                fontWeight: 800,
                letterSpacing: -0.5,
              }}
            >
              {card.value}
            </Typography>

            {/* Subtitle */}
            <Typography
              sx={{
                color: "#68758f",
                fontSize: 9,
                mt: 0.7,
              }}
            >
              {card.subtitle}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default SummaryCards;