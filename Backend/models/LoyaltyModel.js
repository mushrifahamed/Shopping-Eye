import mongoose from 'mongoose';

// Loyalty Schema
const LoyaltySchema = new mongoose.Schema({
  ID: { // Define the ID field
    type: String,
    unique: true, // Ensure that each ID is unique
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  redeemedPoints: {
    type: Number,
    default: 0,
  },
  expirationDate: {
    type: Date,
    default: function () {
      const currentYear = new Date().getFullYear();
      return new Date(currentYear, 11, 31); // Sets expiration at the end of the year
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Static method to reset points after expiration
LoyaltySchema.statics.checkAndResetExpiredPoints = async function () {
  const currentDate = new Date();
  const loyaltyAccounts = await this.find({
    expirationDate: { $lt: currentDate }, // Find all expired accounts
  });

  loyaltyAccounts.forEach(async (account) => {
    account.points = 0; // Reset points
    account.expirationDate = new Date(currentDate.getFullYear(), 11, 31); // Set new expiration for next year
    await account.save();
  });
};

const Loyalty = mongoose.model('Loyalty', LoyaltySchema);
export default Loyalty;
