import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import Transaction from "./models/Transaction";
import User from "./models/User";

// ============================================================
// FINX DATABASE SEED ENGINE
// USERS + TRANSACTIONS
// ============================================================

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/finx";

// ============================================================
// SAMPLE FINX ADMIN
// ============================================================

const adminEmail = "admin@finx.com";
const adminPassword = "123456";

// ============================================================
// TRANSACTION DATA
// ============================================================
//
// This imports the dataset you already placed in the
// frontend project.
//
// ============================================================

import transactionsData from "../../src/data/transactions.json";

// ============================================================
// SEED DATABASE
// ============================================================

const seedDatabase = async (): Promise<void> => {
  try {
    console.log("");
    console.log("╔══════════════════════════════════════╗");
    console.log("║       FINX DATABASE SEED ENGINE      ║");
    console.log("╚══════════════════════════════════════╝");
    console.log("");

    // --------------------------------------------------------
    // Connect MongoDB
    // --------------------------------------------------------

    await mongoose.connect(MONGO_URI);

    console.log("✓ MongoDB connected");

    // --------------------------------------------------------
    // Clear existing transactions
    // --------------------------------------------------------

    await Transaction.deleteMany({});

    console.log("✓ Existing transactions cleared");

    // --------------------------------------------------------
    // Insert transactions
    // --------------------------------------------------------

    await Transaction.insertMany(
      transactionsData
    );

    console.log(
      `✓ ${transactionsData.length} transactions inserted`
    );

    // --------------------------------------------------------
    // Check admin user
    // --------------------------------------------------------

    let adminUser =
      await User.findOne({
        email: adminEmail,
      });

    // --------------------------------------------------------
    // Create admin if missing
    // --------------------------------------------------------

    if (!adminUser) {
      const hashedPassword =
        await bcrypt.hash(
          adminPassword,
          12
        );

      adminUser = await User.create({
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });

      console.log("✓ FINX admin user created");
    } else {
      console.log("✓ FINX admin user already exists");
    }

    // --------------------------------------------------------
    // Final status
    // --------------------------------------------------------

    console.log("");
    console.log("╔══════════════════════════════════════╗");
    console.log("║          FINX SEED COMPLETE         ║");
    console.log("╠══════════════════════════════════════╣");
    console.log("║  DATABASE : ● READY                 ║");
    console.log("║  USERS    : ● READY                 ║");
    console.log("║  DATA     : ● LOADED                ║");
    console.log("╚══════════════════════════════════════╝");
    console.log("");

    console.log("LOGIN CREDENTIALS");
    console.log("-----------------");
    console.log(`Email    : ${adminEmail}`);
    console.log(`Password : ${adminPassword}`);
    console.log("");

    await mongoose.disconnect();

    process.exit(0);

  } catch (error) {
    console.error("");
    console.error(
      "❌ FINX DATABASE SEED FAILED:"
    );
    console.error(error);

    await mongoose.disconnect();

    process.exit(1);
  }
};

// ============================================================
// START SEED
// ============================================================

seedDatabase();