import mongoose from 'mongoose';

const promotionSchema = mongoose.Schema(
  {
   
    ID: {
      type: String,
      required: [true, "Please Enter a ID"],
      trim: true,
    },
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
      required: true,
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

);

const Promotion = mongoose.model("Promotion", promotionSchema);
export default Promotion;
