import Promotion from '../models/promotionModel';
const fs = require("fs");
const Promotion = require("../models/promotionModel"); // Replace with the actual path
const moment = require("moment");

// Create a new promotion
const createPromotion = async (req, res) => {
  try {
    const { title, description, start_date, end_date, percentage } = req.body;
    let imagePath = "uploads/images/No-Image-Placeholder.png";
    if (req.file && req.file.path) {
      imagePath = req.file.path;
    }

    const newPromotion = {
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
const listPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find({});
    res.status(200).json(promotions);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

// Get a promotion by ID
const listPromotionById = async (req, res) => {
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
const updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
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
const deletePromotion = async (req, res) => {
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
const getPromotionsByDateRange = async (req, res) => {
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

exports.createPromotion = createPromotion;
exports.listPromotions = listPromotions;
exports.listPromotionById = listPromotionById;
exports.updatePromotion = updatePromotion;
exports.deletePromotion = deletePromotion;
exports.getPromotionsByDateRange = getPromotionsByDateRange;
