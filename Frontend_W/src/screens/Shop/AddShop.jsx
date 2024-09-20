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
      const uniqueImageName = `${Date.now()}-${image.name}`;
      const storage = getStorage(firebaseDB);
      const storageRef = ref(storage, `images/${uniqueImageName}`);
      await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Image URL:', downloadURL);

      const shopData = {
        name,
        description,
        location,
        contactInfo: {
          phone,
          email,
        },
        image: downloadURL,
      };

      const response = await fetch('http://localhost:8089/api/admin/shops/addshop', {
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

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-800">Add Shop</h2>
          {success && <p className="text-sm text-green-500">{success}</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}
          {uploading && <p className="text-sm text-blue-500">Uploading image...</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className='mb-6 mr-4'>
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
              <div className='mb-6'>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                />
              </div>
              <div className='mb-6 mr-4'>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
                <input
                  type="file"
                  id="image"
                  onChange={handleFileChange}
                  className="w-full mt-1"
                  required
                />
              </div>
              <div className='mb-6'>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                />
              </div>
              <div className="col-span-2 mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                  required
                />
              </div>
              <div className="col-span-2 mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                />
              </div>
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
