import mongoose, { Document, Schema } from "mongoose";

// ============================================================
// FINX TRANSACTION DATA INTERFACE
// ============================================================

export interface ITransaction extends Document {
  id: string;
  date: string;
  amount: number;
  category: "Revenue" | "Expense";
  status: "Paid" | "Pending";
  user_id: string;
  user_profile: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// FINX TRANSACTION SCHEMA
// ============================================================

const transactionSchema = new Schema<ITransaction>(
  {
    // --------------------------------------------------------
    // TRANSACTION IDENTIFIER
    // --------------------------------------------------------

    id: {
      type: String,
      required: [true, "Transaction ID is required"],
      unique: true,
      index: true,
      trim: true,
    },

    // --------------------------------------------------------
    // TRANSACTION DATE
    // --------------------------------------------------------

    date: {
      type: String,
      required: [true, "Transaction date is required"],
      index: true,
      trim: true,
    },

    // --------------------------------------------------------
    // TRANSACTION AMOUNT
    // --------------------------------------------------------

    amount: {
      type: Number,
      required: [true, "Transaction amount is required"],
      min: [0, "Transaction amount cannot be negative"],
      index: true,
    },

    // --------------------------------------------------------
    // FINANCIAL CATEGORY
    // --------------------------------------------------------

    category: {
      type: String,
      required: [true, "Transaction category is required"],
      enum: {
        values: ["Revenue", "Expense"],
        message: "Category must be Revenue or Expense",
      },
      index: true,
    },

    // --------------------------------------------------------
    // PAYMENT STATUS
    // --------------------------------------------------------

    status: {
      type: String,
      required: [true, "Transaction status is required"],
      enum: {
        values: ["Paid", "Pending"],
        message: "Status must be Paid or Pending",
      },
      index: true,
    },

    // --------------------------------------------------------
    // USER IDENTIFIER
    // --------------------------------------------------------

    user_id: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
      trim: true,
    },

    // --------------------------------------------------------
    // USER PROFILE
    // --------------------------------------------------------

    user_profile: {
      type: String,
      required: [true, "User profile is required"],
      trim: true,
    },
  },

  // ==========================================================
  // AUTOMATIC DATABASE TIMESTAMPS
  // ==========================================================

  {
    timestamps: true,
    versionKey: false,
  }
);

// ============================================================
// FINX DATABASE PERFORMANCE INDEXES
// ============================================================

transactionSchema.index({
  category: 1,
  status: 1,
});

transactionSchema.index({
  date: 1,
  amount: 1,
});

transactionSchema.index({
  user_id: 1,
  date: -1,
});

// ============================================================
// FINX TRANSACTION MODEL
// ============================================================

const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema
);

export default Transaction;