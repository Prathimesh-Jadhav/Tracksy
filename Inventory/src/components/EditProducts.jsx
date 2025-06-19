import React, { useEffect, useState } from 'react';
import { X, Upload, ImageIcon, Package, DollarSign, Tag, Hash } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditProduct = ({ isOpen, setIsOpen, editProductDetails, getAllProducts,productsData }) => {
  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    costPrice: '',
    sellingPrice: '',
    category: '',
    image: null,
    icon: null
  });
  const [imagePreview, setImagePreview] = useState('');
  const [iconPreview, setIconPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [categories, setCategories] = useState([]);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');


  useEffect(() => {
     const categoriesSet = new Set(productsData.map(product => product.category));
     const categoriesArray = Array.from(categoriesSet);
     setCategories(categoriesArray);
  }, [productsData]);

  useEffect(() => {
    if (editProductDetails && isOpen) {
      setFormData({
        productId: editProductDetails.productId || '',
        productName: editProductDetails.productName || '',
        costPrice: editProductDetails.costPrice || '',
        sellingPrice: editProductDetails.sellingPrice || '',
        category: editProductDetails.category || '',
        image: null,
        icon: null
      });
      setImagePreview(editProductDetails.image ? `${import.meta.env.VITE_BASE_URL}/${editProductDetails.image}`: '');
      setIconPreview( editProductDetails.icon ? `${import.meta.env.VITE_BASE_URL}/${editProductDetails.image}` :'');
    }
  }, [editProductDetails, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    if (value === 'other') {
      setShowCustomCategory(true);
      setFormData(prev => ({
        ...prev,
        category: ''
      }));
    } else {
      setShowCustomCategory(false);
      setCustomCategory('');
      setFormData(prev => ({
        ...prev,
        category: value
      }));
    }
  };

  const handleCustomCategoryChange = (e) => {
    const { value } = e.target;
    setCustomCategory(value);
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [e.target.name]: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'image') {
          setImagePreview(reader.result);
        } else {
          setIconPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('productId', formData.productId);
      formDataToSend.append('productName', formData.productName);
      formDataToSend.append('costPrice', formData.costPrice);
      formDataToSend.append('sellingPrice', formData.sellingPrice);
      formDataToSend.append('category', formData.category);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      if (formData.icon) {
        formDataToSend.append('icon', formData.icon);
      }

      setLoading(true);

      // Replace with your actual API endpoint
      const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/productRoutes/updateProduct/${formData.productId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
           'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      if (response.status === 200) {
        toast.success('Product updated successfully!', 'success');
        getAllProducts(); // Refresh the product list
        setFormData({
          productId: '',
          productName: '',
          costPrice: '',
          sellingPrice: '',
          category: '',
          image: null,
          icon: null
        });
        closeModal();
      } else {
        toast.error('Failed to update product. Please try again.', 'error');
      }
       
    } catch (error) {
      toast.error('Failed to update product. Please try again.', 'error');
      console.error('Error updating product:', error);
    } finally {
      setLoading(false);
    }

    setLoading(false);

  };

  const closeModal = () => {
    setIsOpen(false);
    setFormData({
      productId: '',
      productName: '',
      costPrice: '',
      sellingPrice: '',
      category: '',
      image: null,
      icon: null
    });
    setImagePreview('');
    setIconPreview('');
    setShowCustomCategory(false);
    setCustomCategory('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-60 px-6 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}
      
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="text-blue-600" size={28} />
            Edit Product
          </h2>
          <button
            onClick={closeModal}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image and Icon Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main Image */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <ImageIcon size={16} />
                Product Image
              </label>
              <div className="relative">
                <div className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                      <p className="text-sm text-gray-500">Upload product image</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  name='image'
                  onChange={(e) => handleFileChange(e, 'image')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Icon */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Tag size={16} />
                Product Icon
              </label>
              <div className="relative">
                <div className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                  {iconPreview ? (
                    <img
                      src={iconPreview}
                      alt="Icon preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                      <p className="text-sm text-gray-500">Upload product icon</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  name='icon'
                  onChange={(e) => handleFileChange(e, 'icon')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product ID */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Hash size={16} />
                Product ID
              </label>
              <input
                type="text"
                name="productId"
                value={formData.productId}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter product ID"
                required
              />
            </div>

            {/* Product Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Package size={16} />
                Product Name
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Cost Price */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <DollarSign size={16} />
                Cost Price
              </label>
              <input
                type="number"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter cost price"
                min="0"
                step="0.01"
                required
              />
            </div>

            {/* Selling Price */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <DollarSign size={16} />
                Selling Price
              </label>
              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter selling price"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Tag size={16} />
              Category
            </label>
            <select
              name="category"
              value={showCustomCategory ? 'other' : formData.category}
              onChange={handleCategoryChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="other">Other (Enter new category)</option>
            </select>
            
            {/* Custom Category Input */}
            {showCustomCategory && (
              <input
                type="text"
                value={customCategory}
                onChange={handleCustomCategoryChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mt-2"
                placeholder="Enter new category name"
                required
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r bg-gray-800 text-white rounded-lg hover:bg-black transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </div>
              ) : (
                'Update Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;