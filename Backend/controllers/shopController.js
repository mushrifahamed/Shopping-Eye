import Shop from '../models/shopModel.js';

// Add a new shop
export const addShop = async (req, res) => {
  const { name, image, description, location, contactInfo, products } = req.body;

  // Debugging: Log the request body
  console.log('Received data:', {
    name,
    image,
    description,
    location,
    contactInfo,
    products,
  });

  try {
    const newShop = new Shop({
      name,
      image,
      description,
      location,
      contactInfo,
      products,
    });

    await newShop.save();
    res.status(201).json(newShop);
  } catch (error) {
    console.error('Error creating shop:', error);
    res.status(500).json({ message: error.message });
  }
};


// Get all shops
export const getShops = async (req, res) => {
  try {
    const shops = await Shop.find().populate('products');
    res.status(200).json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific shop by ID
export const getShopById = async (req, res) => {
  const { id } = req.params;

  try {
    const shop = await Shop.findById(id).populate('products');
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    res.status(200).json(shop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
