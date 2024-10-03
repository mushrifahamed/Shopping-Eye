import mongoose from 'mongoose';

const tapCountSchema = new mongoose.Schema({
  objectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'objectType', // Dynamically reference the model based on objectType
  },
  objectType: {
    type: String,
    required: true,
    enum: ['Product', 'Shop'], // Specifies whether it's a product or shop
  },
  count: {
    type: Number,
    default: 1, // Default count starts at 1, will increment on every tap
  },
  lastTappedAt: {
    type: Date,
    default: Date.now, // Track the last time the product or shop was tapped
  },
  createdAt: {
    type: Date,
    default: Date.now, // Track when the first tap was recorded
  },
});

const TapCount = mongoose.model('TapCount', tapCountSchema);

export default TapCount;
