import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebaseDB from '../../firebase'; // Adjust the import path to your firebase configuration
import { useParams } from 'react-router-dom'; // Import useParams to get the shop ID from the URL
import Sidebar from '../../components/SideBar';

const AddProduct = () => {
  const { id: shopId } = useParams(); // Get the shop ID from the URL
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError('Image is required');
      return;
    }

    setUploading(true);

    try {
      // Generate a unique image name
      const uniqueImageName = `${Date.now()}-${image.name}`;

      // Upload image to Firebase Storage
      const storage = getStorage(firebaseDB);
      const storageRef = ref(storage, `images/${uniqueImageName}`);
      await uploadBytes(storageRef, image);

      // Get download URL of the uploaded image
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Image URL:', downloadURL); // Log the download URL

      // Create the product object to be sent to the server
      const product = {
        name,
        description,
        price,
        category,
        imageUrl: downloadURL, // Save the download URL of the image
        shopId, // Add the shop ID to the product object
      };

      // Send the product data to the backend
      const response = await fetch('http://localhost:8089/api/admin/products/addproduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      alert('Product added successfully!');
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setImage(null);
      setError('');
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Failed to add product');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Add Product</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className={`px-4 py-2 text-white rounded-lg ${uploading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'}`}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
