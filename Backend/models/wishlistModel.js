import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      note: {
        type: String,
        default: "", // Default to empty string
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Define and export the Wishlist model
const Wishlist = mongoose.model("Wishlist", WishlistSchema);

export default Wishlist;
