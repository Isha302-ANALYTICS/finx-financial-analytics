import { Request, Response } from "express";
import Transaction from "../models/Transaction";

// ============================================================
// FINX TRANSACTION CONTROLLER
// Search • Filter • Sort • Pagination • Analytics
// ============================================================

export const getTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // ========================================================
    // QUERY PARAMETERS
    // ========================================================

    const {
      search,
      category,
      status,
      user_id,
      minAmount,
      maxAmount,
      startDate,
      endDate,
      page = "1",
      limit = "10",
      sortBy = "date",
      sortOrder = "desc",
    } = req.query;

    // ========================================================
    // BUILD DATABASE FILTER
    // ========================================================

    const filter: Record<string, unknown> = {};

    // --------------------------------------------------------
    // REAL-TIME SEARCH
    // --------------------------------------------------------

    if (search && typeof search === "string") {
      filter.$or = [
        {
          id: {
            $regex: search,
            $options: "i",
          },
        },
        {
          user_id: {
            $regex: search,
            $options: "i",
          },
        },
        {
          user_profile: {
            $regex: search,
            $options: "i",
          },
        },
        {
          category: {
            $regex: search,
            $options: "i",
          },
        },
        {
          status: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // --------------------------------------------------------
    // CATEGORY FILTER
    // --------------------------------------------------------

    if (category && typeof category === "string") {
      filter.category = category;
    }

    // --------------------------------------------------------
    // STATUS FILTER
    // --------------------------------------------------------

    if (status && typeof status === "string") {
      filter.status = status;
    }

    // --------------------------------------------------------
    // USER FILTER
    // --------------------------------------------------------

    if (user_id && typeof user_id === "string") {
      filter.user_id = user_id;
    }

    // ========================================================
    // AMOUNT RANGE FILTER
    // ========================================================

    if (minAmount || maxAmount) {
      const amountFilter: Record<string, number> = {};

      if (minAmount && typeof minAmount === "string") {
        const value = Number(minAmount);

        if (!Number.isNaN(value)) {
          amountFilter.$gte = value;
        }
      }

      if (maxAmount && typeof maxAmount === "string") {
        const value = Number(maxAmount);

        if (!Number.isNaN(value)) {
          amountFilter.$lte = value;
        }
      }

      filter.amount = amountFilter;
    }

    // ========================================================
    // DATE RANGE FILTER
    // ========================================================

    if (startDate || endDate) {
      const dateFilter: Record<string, string> = {};

      if (startDate && typeof startDate === "string") {
        dateFilter.$gte = startDate;
      }

      if (endDate && typeof endDate === "string") {
        dateFilter.$lte = endDate;
      }

      filter.date = dateFilter;
    }

    // ========================================================
    // PAGINATION
    // ========================================================

    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 10, 1), 100);

    const skip = (currentPage - 1) * pageSize;

    // ========================================================
    // SORTING
    // ========================================================

    const allowedSortFields = [
      "id",
      "date",
      "amount",
      "category",
      "status",
      "user_id",
      "user_profile",
      "createdAt",
    ];

    const requestedSort =
      typeof sortBy === "string" ? sortBy : "date";

    const safeSortField = allowedSortFields.includes(requestedSort)
      ? requestedSort
      : "date";

    const safeSortOrder =
      sortOrder === "asc" ? 1 : -1;

    const sort: Record<string, 1 | -1> = {
      [safeSortField]: safeSortOrder,
    };

    // ========================================================
    // DATABASE QUERY
    // ========================================================

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .lean(),

      Transaction.countDocuments(filter),
    ]);

    // ========================================================
    // PAGINATION METRICS
    // ========================================================

    const totalPages = Math.ceil(total / pageSize);

    // ========================================================
    // FINX API RESPONSE
    // ========================================================

    res.status(200).json({
      success: true,
      system: "FINX",
      data: transactions,

      pagination: {
        page: currentPage,
        limit: pageSize,
        totalRecords: total,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },

      filters: {
        search: search || null,
        category: category || null,
        status: status || null,
        user_id: user_id || null,
        minAmount: minAmount || null,
        maxAmount: maxAmount || null,
        startDate: startDate || null,
        endDate: endDate || null,
      },

      sorting: {
        field: safeSortField,
        order: safeSortOrder === 1 ? "asc" : "desc",
      },

      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("FINX_TRANSACTION_QUERY_ERROR:", error);

    res.status(500).json({
      success: false,
      system: "FINX",
      error: "TRANSACTION_QUERY_FAILED",
      message: "Unable to retrieve financial transactions.",
      timestamp: new Date().toISOString(),
    });
  }
};

// ============================================================
// FINX DASHBOARD ANALYTICS
// ============================================================

export const getTransactionAnalytics = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics = await Transaction.aggregate([
      {
        $group: {
          _id: "$category",
          totalAmount: {
            $sum: "$amount",
          },
          transactionCount: {
            $sum: 1,
          },
        },
      },
    ]);

    let totalRevenue = 0;
    let totalExpenses = 0;

    let revenueCount = 0;
    let expenseCount = 0;

    analytics.forEach((item) => {
      if (item._id === "Revenue") {
        totalRevenue = item.totalAmount;
        revenueCount = item.transactionCount;
      }

      if (item._id === "Expense") {
        totalExpenses = item.totalAmount;
        expenseCount = item.transactionCount;
      }
    });

    const netBalance = totalRevenue - totalExpenses;

    const savings = netBalance > 0 ? netBalance : 0;

    res.status(200).json({
      success: true,
      system: "FINX",

      metrics: {
        totalRevenue,
        totalExpenses,
        netBalance,
        savings,
      },

      transactionCounts: {
        revenue: revenueCount,
        expense: expenseCount,
        total: revenueCount + expenseCount,
      },

      categoryBreakdown: analytics,

      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("FINX_ANALYTICS_ERROR:", error);

    res.status(500).json({
      success: false,
      system: "FINX",
      error: "ANALYTICS_QUERY_FAILED",
      message: "Unable to calculate financial analytics.",
      timestamp: new Date().toISOString(),
    });
  }
};