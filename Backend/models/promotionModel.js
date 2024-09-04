import mongoose from 'mongoose';
const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  image_url: {
    type: String,
  },
},
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Promotion', promotionSchema);
