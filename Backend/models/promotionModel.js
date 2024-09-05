const mongoose = require("mongoose");

const promotionSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter a title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please enter a description"],
      trim: true,
    },
    start_date: {
      type: Date,
      required: [true, "Please enter a start date"],
    },
    end_date: {
      type: Date,
      required: [true, "Please enter an end date"],
    },
    percentage: {
      type: Number,
      required: [true, "Please enter a percentage"],
      min: [0, "Percentage must be at least 0"],
      max: [100, "Percentage cannot exceed 100"],
    },
    image_url: {
      type: String,
      required: false,
      trim: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

const Promotion = mongoose.model("Promotion", promotionSchema);
module.exports = Promotion;
