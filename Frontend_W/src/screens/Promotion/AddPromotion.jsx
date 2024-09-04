import React, { useState } from 'react';

const PromotionForm = () => {
  const [promotion, setPromotion] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    image_url: '',
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
      console.log('Promotion data:', promotion);
      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        const response = await fetch('https://your-server.com/upload', {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          console.log('Image uploaded successfully');
        } else {
          console.error('Image upload failed');
        }
      }
    }
  };

  return (
    <div>
      <h2>Add Promotion</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={promotion.title}
            onChange={handleChange}
          />
          {errors.title && <p className="error">{errors.title}</p>}
        </div>

        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={promotion.description}
            onChange={handleChange}
          />
          {errors.description && <p className="error">{errors.description}</p>}
        </div>

        <div>
          <label>Start Date:</label>
          <input
            type="date"
            name="start_date"
            value={promotion.start_date}
            onChange={handleChange}
          />
          {errors.start_date && <p className="error">{errors.start_date}</p>}
        </div>

        <div>
          <label>End Date:</label>
          <input
            type="date"
            name="end_date"
            value={promotion.end_date}
            onChange={handleChange}
          />
          {errors.end_date && <p className="error">{errors.end_date}</p>}
          {errors.dateRange && <p className="error">{errors.dateRange}</p>}
        </div>

        <div>
          <label>Image:</label>
          <button type="button" onClick={handleAddImageClick}>Add Image</button>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />
          {promotion.image_url && (
            <div>
              <img
                src={promotion.image_url}
                alt="Promotion Preview"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
            </div>
          )}
        </div>

        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default PromotionForm;
