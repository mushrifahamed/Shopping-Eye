import mongoose from 'mongoose';

const PromotionSchema = new mongoose.Schema({
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
    required: true, // Image URL for the product
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const promotion = mongoose.model('promotion', PromotionSchema);

export default promotion;
