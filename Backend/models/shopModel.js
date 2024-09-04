import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the Shop schema
const shopSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  location: {
    type: String,
    trim: true,
  },
  contactInfo: {
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
  },
});

// Create the Shop model
const Shop = mongoose.model('Shop', shopSchema);

export default Shop;
