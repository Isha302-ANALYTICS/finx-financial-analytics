import mongoose, {
  Document,
  Schema,
  Model,
} from "mongoose";

import bcrypt from "bcryptjs";

// ============================================================
// FINX AUTHENTICATION CORE
// USER MODEL | IDENTITY | SECURITY | ACCESS CONTROL
// ============================================================

export interface IUser extends Document {
  email: string;
  password: string;
  role: "admin" | "user";

  comparePassword(
    candidatePassword: string
  ): Promise<boolean>;
}

// ============================================================
// FINX USER SCHEMA
// ============================================================

const userSchema = new Schema<IUser>(
  {
    // ========================================================
    // IDENTITY CORE
    // ========================================================

    email: {
      type: String,

      required: [
        true,
        "FINX_IDENTITY_ERROR: Email is required",
      ],

      unique: true,

      index: true,

      lowercase: true,

      trim: true,

      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "FINX_IDENTITY_ERROR: Invalid email format",
      ],
    },

    // ========================================================
    // SECURITY CORE
    // ========================================================

    password: {
      type: String,

      required: [
        true,
        "FINX_SECURITY_ERROR: Password is required",
      ],

      minlength: [
        6,
        "FINX_SECURITY_ERROR: Password must contain at least 6 characters",
      ],
    },

    // ========================================================
    // ACCESS CONTROL
    // ========================================================

    role: {
      type: String,

      enum: {
        values: ["admin", "user"],

        message:
          "FINX_ACCESS_ERROR: Invalid user role",
      },

      default: "user",

      index: true,
    },
  },

  // ==========================================================
  // SYSTEM METADATA
  // ==========================================================

  {
    timestamps: true,

    versionKey: false,

    collection: "finx_users",
  }
);

// ============================================================
// FINX PASSWORD ENCRYPTION ENGINE
// ============================================================
//
// Plain Password
//      ↓
// Bcrypt Salt
//      ↓
// Secure Hash
//      ↓
// MongoDB
//
// ============================================================

userSchema.pre(
  "save",
  async function () {
    // --------------------------------------------------------
    // Prevent unnecessary re-hashing
    // --------------------------------------------------------

    if (!this.isModified("password")) {
      return;
    }

    // --------------------------------------------------------
    // Generate secure salt
    // --------------------------------------------------------

    const salt = await bcrypt.genSalt(12);

    // --------------------------------------------------------
    // Generate password hash
    // --------------------------------------------------------

    this.password = await bcrypt.hash(
      this.password,
      salt
    );
  }
);

// ============================================================
// FINX PASSWORD VERIFICATION ENGINE
// ============================================================

userSchema.methods.comparePassword =
  async function (
    candidatePassword: string
  ): Promise<boolean> {
    return bcrypt.compare(
      candidatePassword,
      this.password
    );
  };

// ============================================================
// FINX DATABASE INDEX
// ============================================================

userSchema.index(
  {
    email: 1,
  },
  {
    unique: true,
  }
);

// ============================================================
// FINX USER MODEL
// ============================================================

const User: Model<IUser> =
  mongoose.model<IUser>(
    "User",
    userSchema
  );

// ============================================================
// FINX AUTH MODEL EXPORT
// ============================================================

export default User;