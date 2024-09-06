import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebaseDB from '../../firebase'; // Ensure you have the correct path to your Firebase configuration
import Sidebar from '../../components/SideBar';

const PromotionForm = () => {
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    image_url: '',
    percentage: '',
  });
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const validate = () => {
    const newErrors = {};
    if (!promotion.title) newErrors.title = 'Title is required';
    if (!promotion.description) newErrors.description = 'Description is required';
    if (!promotion.start_date) newErrors.start_date = 'Start date is required';
    if (!promotion.end_date) newErrors.end_date = 'End date is required';
    if (new Date(promotion.start_date) > new Date(promotion.end_date)) {
      newErrors.dateRange = 'End date must be after the start date';
    }
    if (promotion.percentage === '' || promotion.percentage < 0 || promotion.percentage > 100) {
      newErrors.percentage = 'Percentage must be between 0 and 100';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromotion({
      ...promotion,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPromotion({
          ...promotion,
          image_url: reader.result,
        });
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setUploading(true);
      try {
        // Submit form data
        const response = await axios.post('http://localhost:8089/api/promotion/createPromotion', {
          ...promotion,
          image_url: image ? await uploadImageToFirebase(image) : promotion.image_url,
        }, {
          headers: { 'Content-Type': 'application/json' },
        });
        console.log('Promotion created', response.data);
        navigate("/PromotionList"); // Navigate to PromotionList after successful submission
      } catch (error) {
        console.error('Error creating promotion', error);
      } finally {
        setUploading(false);
      }
    }
  };

  const uploadImageToFirebase = async (file) => {
    // Firebase storage reference and upload logic
    const storage = getStorage(firebaseDB);
    const uniqueImageName = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `images/${uniqueImageName}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold mb-6 text-gray-900">Create New Promotion</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {uploading && <p className="text-blue-500">Uploading image...</p>}
            <div>
              <label htmlFor="title" className="block text-lg font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={promotion.title}
                onChange={handleChange}
                className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Title"
                required
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-lg font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={promotion.description}
                onChange={handleChange}
                className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Description"
                required
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="start_date" className="block text-lg font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={promotion.start_date}
                  onChange={handleChange}
                  className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
              </div>

              <div>
                <label htmlFor="end_date" className="block text-lg font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={promotion.end_date}
                  onChange={handleChange}
                  className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
                {errors.dateRange && <p className="text-red-500 text-sm mt-1">{errors.dateRange}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="percentage" className="block text-lg font-medium text-gray-700">Percentage</label>
              <input
                type="number"
                id="percentage"
                name="percentage"
                value={promotion.percentage}
                onChange={handleChange}
                className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter percentage"
                required
              />
              {errors.percentage && <p className="text-red-500 text-sm mt-1">{errors.percentage}</p>}
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700">Image</label>
              <button
                type="button"
                onClick={handleAddImageClick}
                className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Image
              </button>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                ref={fileInputRef}
              />
              {promotion.image_url && (
                <div className="mt-4">
                  <img
                    src={promotion.image_url}
                    alt="Promotion Preview"
                    className="w-40 h-40 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-center items-center">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PromotionForm;
