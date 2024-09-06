import Product from '../models/Product';
import Shop from '../models/shopModel.js';

// Method to find the shop based on a product's attributes
export const getShopByProduct = async (req, res) => {
  const { productName } = req.params;

  try {
    // Fetch the product by its name (or any other identifier you choose)
    const product = await Product.findOne({ name: productName });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Fetch all shops
    const shops = await Shop.find();

    // Compare each shop with the product (based on the name, category, or other attributes)
    const matchingShops = shops.filter((shop) => {
      return shop.products.some((p) => p.name === product.name); // Adjust the condition based on your matching logic
    });

    // Check if any shop matches the criteria
    if (matchingShops.length === 0) {
      return res.status(404).json({ message: 'No shop found for this product' });
    }

    // Return the first matching shop (or all matching shops, depending on your use case)
    res.status(200).json(matchingShops[0]);
  } catch (error) {
    console.error('Error fetching shop:', error);
    res.status(500).json({ message: 'Error fetching shop' });
  }
};
