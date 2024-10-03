import TapCount from '../models/TapCountModel.js'; // Adjust the path as necessary

export const handleTapCount = async (req, res) => {
  const { objectId, objectType } = req.body; // Extract from the request body

  // Check if the objectId and objectType are provided
  if (!objectId || !objectType) {
    return res.status(400).json({ message: 'objectId and objectType are required.' });
  }

  try {
    // Find the existing tap count document
    const existingTapCount = await TapCount.findOne({ objectId, objectType });

    if (existingTapCount) {
      // If found, update the count and lastTappedAt
      existingTapCount.count += 1; // Increment the count
      existingTapCount.lastTappedAt = Date.now(); // Update last tapped time
      await existingTapCount.save(); // Save the updated document

      return res.status(200).json(existingTapCount); // Return the updated document
    } else {
      // If not found, create a new tap count document
      const newTapCount = new TapCount({
        objectId,
        objectType,
        count: 1, // Start count at 1
        lastTappedAt: Date.now(),
      });

      await newTapCount.save(); // Save the new document

      return res.status(201).json(newTapCount); // Return the created document
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
