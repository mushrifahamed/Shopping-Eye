import fs from 'fs';
import Promotion from '../models/promotionModel.js';

// Create a new promotion
export const createPromotion = async (req, res) => {
  try {
    const { title, description, start_date, end_date, percentage } = req.body;
    //let imagePath = "uploads/images/No-Image-Placeholder.png";
    //if (req.file && req.file.path) {
     // imagePath = req.file.path;
   // }
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
      //image_url: imagePath,
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
    const latestPromotion = await Promotion.find().sort({ _id: -1 }).limit(1);
    let promotionId;

    if (latestPromotion.length !== 0) {
      const latestId = parseInt(latestPromotion[0].promotionId.slice(1)); // Remove "P" and convert to integer
      promotionId = "P" + String(latestId + 1).padStart(3, "0"); // Increment and pad the number
    } else {
      promotionId = "P001"; // Default first ID
    }
    const { title, description, start_date, end_date, percentage } = req.body;
    const promotion = await Promotion.findById(id);

    if (!promotion) {
      return res.status(404).send({ message: "Promotion not found" });
    }

    let imagePath = promotion.image_url;
    if (req.file && req.file.path) {
      if (imagePath !== "uploads/images/No-Image-Placeholder.png") {
        fs.unlink(imagePath, (err) => {
          if (err) console.error(err);
        });
      }
      imagePath = req.file.path;
    }

    const updatedPromotion = {
      id,
      title,
      description,
      start_date,
      end_date,
      image_url: imagePath,
      percentage,
      updated_at: new Date().toISOString(),
    };

    await Promotion.findByIdAndUpdate(id, updatedPromotion);
    res.status(200).send({ message: "Promotion updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

// Delete a promotion
export const deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const promotion = await Promotion.findById(id);

    if (!promotion) {
      return res.status(404).send({ message: "Promotion not found" });
    }

    const imagePath = promotion.image_url;
    if (imagePath !== "uploads/images/No-Image-Placeholder.png") {
      fs.unlink(imagePath, (err) => {
        if (err) console.error(err);
      });
    }

    await Promotion.findByIdAndDelete(id);
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