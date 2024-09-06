import mongoose from 'mongoose';

const WishlistSchema = new mongoose.Schema({
  // Temporarily, we'll store the user as a string rather than a reference to the AdminUser model.
  user: {
    type: String, // Change this to String for now
    required: true, // Make sure it's required to simulate a user owning the wishlist
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // Reference to the Product model (which you have created)
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Define and export the Wishlist model
const Wishlist = mongoose.model('Wishlist', WishlistSchema);

export default Wishlist;