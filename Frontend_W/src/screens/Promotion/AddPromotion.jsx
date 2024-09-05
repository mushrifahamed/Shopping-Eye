import React, { useState } from 'react';
import axios from 'axios';

const PromotionForm = () => {
  const [promotion, setPromotion] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    image_url: '',
    percentage: '', // New percentage field
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const fileInputRef = React.createRef();

  const validate = () => {
    const newErrors = {};
    if (!promotion.title) newErrors.title = 'Title is required';
    if (!promotion.description) newErrors.description = 'Description is required';
    if (!promotion.start_date) newErrors.start_date = 'Start date is required';
    if (!promotion.end_date) newErrors.end_date = 'End date is required';
    if (new Date(promotion.start_date) > new Date(promotion.end_date)) {
      newErrors.dateRange = 'End date must be after the start date';
    }
    if (!promotion.percentage || promotion.percentage < 0 || promotion.percentage > 100) {
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
      updated_at: new Date().toISOString(),
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
      const formData = new FormData();
      
      // Append promotion data without the image
      formData.append('title', promotion.title);
      formData.append('description', promotion.description);
      formData.append('start_date', promotion.start_date);
      formData.append('end_date', promotion.end_date);
      formData.append('percentage', promotion.percentage);
      formData.append('created_at', promotion.created_at);
      formData.append('updated_at', promotion.updated_at);
      
      try {
        const response = await axios.post('https://localhost:8089/api/promotions/createPromotion', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (response.status === 200) {
          console.log('Promotion created successfully');
          // Optionally reset form state or handle success
        } else {
          console.error('Failed to create promotion');
          // Optionally handle error
        }
      } catch (error) {
        console.error('An error occurred:', error);
        // Optionally handle network error
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold mb-6 text-gray-900">Create new promotion</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-gray-700">Promotion title</label>
          <input
            type="text"
            name="title"
            value={promotion.title}
            onChange={handleChange}
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Title"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={promotion.description}
            onChange={handleChange}
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Description"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-medium text-gray-700">Start date</label>
            <input
              type="date"
              name="start_date"
              value={promotion.start_date}
              onChange={handleChange}
              className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="MM/DD/YYYY"
            />
            {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">End date</label>
            <input
              type="date"
              name="end_date"
              value={promotion.end_date}
              onChange={handleChange}
              className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="MM/DD/YYYY"
            />
            {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
            {errors.dateRange && <p className="text-red-500 text-sm mt-1">{errors.dateRange}</p>}
          </div>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">Percentage</label>
          <input
            type="number"
            name="percentage"
            value={promotion.percentage}
            onChange={handleChange}
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter percentage"
          />
          {errors.percentage && <p className="text-red-500 text-sm mt-1">{errors.percentage}</p>}
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">Image URL</label>
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
  );
};

export default PromotionForm;
