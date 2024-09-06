import Product from '../models/productModel.js';
import Shop from '../models/shopModel.js';

export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, shopId } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category || !imageUrl || !shopId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new product instance
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      imageUrl,
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    // Find the shop by ID and add the product's ObjectID to the products array
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    shop.products.push(savedProduct._id);

    // Save the updated shop with the new product reference
    await shop.save();

    // Send a success response with the saved product data
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Failed to add product' });
  }
};

// Controller to get products for a specific shop
export const getShopProducts = async (req, res) => {
    try {
      const { id } = req.params;
      const shop = await Shop.findById(id).populate('products');
      if (!shop) {
        return res.status(404).json({ message: 'Shop not found' });
      }
      res.status(200).json(shop.products);
    } catch (error) {
      console.error('Error fetching shop products:', error);
      res.status(500).json({ message: 'Failed to fetch products' });
    }
  };
  