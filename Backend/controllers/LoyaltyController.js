import Loyalty from '../models/LoyaltyModel.js';
import User from '../models/UserModel.js'; // Assuming you have a User model to validate the user

// Create a new loyalty account
export const createLoyalty = async (req, res) => {
  try {
    const { userId, phoneNumber, points, expirationDate } = req.body;

    // Validate user existence
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a unique ID for the loyalty account
    const latestLoyalty = await Loyalty.find().sort({ _id: -1 }).limit(1);
    let ID;

    if (latestLoyalty.length !== 0 && latestLoyalty[0].ID) {
      const latestId = parseInt(latestLoyalty[0].ID.slice(1)); // Remove "L" and convert to integer
      ID = "L" + String(latestId + 1).padStart(3, "0"); // Increment and pad the number
    } else {
      ID = "L001"; // Default first ID
    }

    // Create a new loyalty account object
    const newLoyalty = {
      ID,
      userId,
      phoneNumber,
      points: points || 0, // Default points to 0 if not provided
      expirationDate: expirationDate || new Date(new Date().getFullYear(), 11, 31), // Default to the end of the current year
      createdAt: new Date(),
    };

    // Save the new loyalty account to the database
    const loyalty = await Loyalty.create(newLoyalty);
    res.status(201).json(loyalty);
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error for unique fields like phoneNumber
      return res.status(400).json({ message: 'Phone number already exists. Please use a different phone number.' });
    }
    
    // Log the error for debugging
    console.error('Error creating loyalty account:', error);
    res.status(500).send({ message: error.message });
  }
};

export const addPoints = async (req, res) => {
  const { id } = req.params;
  const { points } = req.body;

  try {
    const loyalty = await Loyalty.findById(id);

    if (!loyalty) {
      return res.status(404).json({ message: 'Loyalty account not found' });
    }

    loyalty.points += parseInt(points);
    await loyalty.save();

    res.status(200).json(loyalty);
  } catch (error) {
    console.error('Error adding points:', error);
    res.status(500).send({ message: error.message });
  }
};

export const redeemPoints = async (req, res) => {
  const { id } = req.params;
  const { redeemPoints } = req.body;

  try {
    const loyalty = await Loyalty.findById(id);

    if (!loyalty) {
      return res.status(404).json({ message: 'Loyalty account not found' });
    }

    if (loyalty.points < redeemPoints) {
      return res.status(400).json({ message: 'Insufficient points to redeem' });
    }

    loyalty.points -= parseInt(redeemPoints);
    loyalty.redeemedPoints += parseInt(redeemPoints);
    await loyalty.save();

    res.status(200).json(loyalty);
  } catch (error) {
    console.error('Error redeeming points:', error);
    res.status(500).send({ message: error.message });
  }
};



// Delete a loyalty account by ID
export const deleteLoyalty = async (req, res) => {
  const { id } = req.params; // Use destructuring to get ID from parameters

  try {
    // Use findByIdAndDelete to delete the loyalty account
    const result = await Loyalty.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Loyalty account not found' });
    }

    res.status(200).json({ message: 'Loyalty account deleted successfully' });
  } catch (error) {
    console.error('Error deleting loyalty account:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// List all loyalty accounts
export const listLoyalty = async (req, res) => {
  try {
    const loyaltyAccounts = await Loyalty.find();
    res.status(200).json(loyaltyAccounts);
  } catch (error) {
    console.error('Error fetching loyalty accounts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Controller for generating the loyalty report
export const getLoyaltyReport = async (req, res) => {
  try {
    // Find all users
    const allLoyaltyUsers = await Loyalty.find();

    // Prepare the report data
    const reportData = allLoyaltyUsers.map(user => {
      const totalPoints = user.points;
      const totalRedeemedPoints = user.redeemedPoints;
      const totalEarnedPoints = totalPoints + totalRedeemedPoints;

      const percentageRedeemed = totalEarnedPoints > 0 ? (totalRedeemedPoints / totalEarnedPoints) * 100 : 0;
      const percentageBalance = totalEarnedPoints > 0 ? (totalPoints / totalEarnedPoints) * 100 : 0;

      return {
        userID: user.ID,
        phoneNumber: user.phoneNumber,
        totalPoints,
        totalRedeemedPoints,
        percentageRedeemed: percentageRedeemed.toFixed(2),
        percentageBalance: percentageBalance.toFixed(2),
      };
    });

    // Sort the report data by total points in descending order and take the top 5
    const topUsers = reportData.sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 5);

    // Calculate overall totals from top 5 users
    const totalPoints = topUsers.reduce((sum, report) => sum + report.totalPoints, 0);
    const totalRedeemedPoints = topUsers.reduce((sum, report) => sum + report.totalRedeemedPoints, 0);
    const totalEarnedPoints = totalPoints + totalRedeemedPoints;

    const totalPercentageRedeemed = totalEarnedPoints > 0 ? ((totalRedeemedPoints / totalEarnedPoints) * 100).toFixed(2) : 0;
    const totalPercentageBalance = totalEarnedPoints > 0 ? ((totalPoints / totalEarnedPoints) * 100).toFixed(2) : 0;

    // Count the total number of users
    const totalUsers = allLoyaltyUsers.length;

    // Add overall totals to the response
    const overallTotals = {
      totalPoints,
      totalRedeemedPoints,
      totalPercentageRedeemed,
      totalPercentageBalance,
      totalUsers,  // Add total users here
    };

    // Return the report data and overall totals as a response
    res.status(200).json({ reportData: topUsers, overallTotals });
  } catch (error) {
    console.error('Error generating loyalty report:', error);
    res.status(500).json({ error: 'Failed to generate loyalty report' });
  }
};







