import React, { useState } from 'react';
import Sidebar from '../../components/SideBar';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebaseDB from '../../firebase'; // Ensure you have the correct path to your Firebase configuration

const AddShopForm = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

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

      // Prepare the shop data with the image URL
      const shopData = {
        name,
        description,
        location,
        contactInfo: {
          phone,
          email,
        },
        image: downloadURL, // Use the download URL of the uploaded image
      };

      // Submit form data with image URL
      const response = await fetch('http://localhost:8089/api/shops/addshop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shopData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add shop');
      }

      setSuccess('Shop added successfully');
      setError('');
      // Clear form fields
      setName('');
      setImage(null);
      setDescription('');
      setLocation('');
      setPhone('');
      setEmail('');
    } catch (error) {
      setError(error.message);
      setSuccess('');
    } finally {
      setUploading(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-800">Add Shop</h2>
          {success && <p className="text-sm text-green-500">{success}</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}
          {uploading && <p className="text-sm text-blue-500">Uploading image...</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
              <input
                type="file"
                id="image"
                onChange={handleFileChange}
                className="w-full mt-1"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Add Shop
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddShopForm;
