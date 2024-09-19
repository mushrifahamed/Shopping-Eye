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

export const deleteShop = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the shop by ID and delete it
    const deletedShop = await Shop.findByIdAndDelete(id);

    if (!deletedShop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.status(200).json({ message: 'Shop deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateShop = async (req, res) => {
  const { id } = req.params; // Shop ID from the request parameters
  const { name, description, location, contactInfo, image } = req.body; // Extract data from request body

  try {
    // Find the shop by ID and update it
    const shop = await Shop.findByIdAndUpdate(
      id,
      { name, description, location, contactInfo, image },
      { new: true, runValidators: true }
    );

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    // Respond with the updated shop
    res.json(shop);
  } catch (error) {
    console.error('Error updating shop:', error);
    res.status(500).json({ message: 'Server error' });
  }
};