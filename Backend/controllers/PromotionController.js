import fs from 'fs';
import Promotion from '../models/promotionModel.js';

// Create a new promotion
export const createPromotion = async (req, res) => {
  try {
    const { title, description, start_date, end_date, percentage ,image_url } = req.body;
    let imagePath = "uploads/images/No-Image-Placeholder.png";
    if (image_url !== '') {
      imagePath = image_url;
    }
   const latestPromotion = await Promotion.find().sort({ _id: -1 }).limit(1);
    let ID;

    if (latestPromotion.length !== 0) {
      const latestId = parseInt(latestPromotion[0].ID.slice(1)); // Remove "P" and convert to integer
      ID = "P" + String(latestId + 1).padStart(3, "0"); // Increment and pad the number
    } else {
      ID = "P001"; // Default first ID
    }
    console.log('Hi')
    console.log(title)

    const newPromotion = {
      ID,
      title,
      description,
      start_date,
      end_date,
      image_url: imagePath,
      percentage,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const promotion = await Promotion.create(newPromotion);
    res.status(201).json(promotion);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

// List all promotions
export const listPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find({});
    res.status(200).json(promotions);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

// Get a promotion by ID
export const listPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).send({ message: "Promotion not found" });
    }
    res.status(200).json(promotion);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

// Update a promotion
export const updatePromotion = async (req, res) => {
  try {
    const { _id } = req.params; // Get the promotion ID from the URL parameters
    const { title, description, start_date, end_date, percentage, image_url } = req.body;

    // Check if the promotion exists
    const promotion = await Promotion.findById(_id);
    if (!promotion) {
      return res.status(404).send({ message: 'Promotion not found' });
    }

    // Update promotion fields
    promotion.title = title || promotion.title;
    promotion.description = description || promotion.description;
    promotion.start_date = start_date || promotion.start_date;
    promotion.end_date = end_date || promotion.end_date;
    promotion.percentage = percentage || promotion.percentage;
    promotion.image_url = image_url !== '' ? image_url : promotion.image_url; // Only update if a new image URL is provided
    promotion.updated_at = new Date().toISOString(); // Update the updated_at field

    // Save the updated promotion
    const updatedPromotion = await promotion.save();

    res.status(200).json(updatedPromotion);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};


// Delete a promotion
export const deletePromotion = async (req, res) => {
  try {
    const { _id } = req.params;
    const promotion = await Promotion.findById(_id);

    if (!promotion) {
      return res.status(404).send({ message: "Promotion not found" });
    }

    const imagePath = promotion.image_url;
    if (imagePath !== "uploads/images/No-Image-Placeholder.png") {
      fs.unlink(imagePath, (err) => {
        if (err) console.error(err);
      });
    }

    await Promotion.findByIdAndDelete(_id);
    res.status(200).send({ message: "Promotion deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

// Get promotions for a specific date range
export const getPromotionsByDateRange = async (req, res) => {
  try {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    const promotions = await Promotion.find({
      start_date: { $gte: startDate },
      end_date: { $lte: endDate },
    });

    res.status(200).json(promotions);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};


export default {}