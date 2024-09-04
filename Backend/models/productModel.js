import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false, // Image URL for the product
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Product = mongoose.model('Product', ProductSchema);

export default Product;
