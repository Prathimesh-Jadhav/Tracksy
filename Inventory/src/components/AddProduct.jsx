import React, { useEffect } from 'react'
import { MdOutlineCancel } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import { Button, Flex } from '@radix-ui/themes/dist/cjs/index.js';
import { imageListClasses } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdCancel } from "react-icons/md";

const AddProduct = ({ setShowAddProduct,productsData, showAddProduct, getAllProducts }) => {
    const [categories, setCategories] = React.useState([]);
    const [openOtherInput, setOpenOtherInput] = React.useState(false);
    const [otherCategory, setOtherCategory] = React.useState('');
    const [formInput, setFormInput] = React.useState({});

    const fileInputRef = React.useRef(null);
    const fileIconRef = React.useRef(null);

    useEffect(() => {
        const handleCategories = () => {
            setCategories(Array.from(new Set(new Array(...productsData.map(product => product.category)))));
        }
        handleCategories();
    }, [productsData])

    const handleCategoryInput = (e) => {
        const value = e.target.value;
        if (value === "Other") {
            setOpenOtherInput(true);
            setFormInput({ ...formInput, category: value });
        } else {
            setOpenOtherInput(false);
            setOtherCategory('');
            setFormInput({ ...formInput, category: value });
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormInput(prev => ({ ...prev, [name]: value }));
    }

    const handleImageInput = (e) => {
        setFormInput({
            ...formInput,
            [e.target.name]: e.target.files[0]
        })
    }

    const handleSubmit = async (e) => {
        console.log("formInput", formInput)
        if (!formInput.productName || !formInput.category || !formInput.items || !formInput.costPrice || !formInput.sellingPrice) return alert('Please fill in all the fields.');

        const formData = new FormData();
        //add data into formData :
        formData.append('productName', formInput.productName);
        formData.append('category', formInput.category);
        formData.append('items', formInput.items);
        formData.append('costPrice', formInput.costPrice);
        formData.append('sellingPrice', formInput.sellingPrice);
        formData.append('image', formInput.image);
        formData.append('icon', formInput.icon);

        console.log("formData", formData)

        //send to backend
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/productRoutes/addProduct`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            toast.success(response.data.message);
        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            }
            else {
                console.error("Error in adding product:", error);
                toast.error("Error in adding Product");
            }
        }

        setFormInput({
            productName: '',
            category: '',
            items: '',
            costPrice: '',
            sellingPrice: '',
            image: '',
            icon: ''
        });
        setShowAddProduct(false);
        getAllProducts();
    }

    const handleCancel = () => {
        setFormInput({
            productName: '',
            category: '',
            items: '',
            costPrice: '',
            sellingPrice: '',
            image: '',
            icon: ''
        });
        setShowAddProduct(false);
    }

    return (
        <div className={`fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 bg-black bg-opacity-30 px-4 transition-all duration-300 ${showAddProduct ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            <div className={`max-w-[420px] max-md:min-w-[300px] md:min-w-[380px] max-h-[85vh] overflow-auto shadow-2xl border border-gray-200 bg-white dark:bg-gray-500 dark:border-gray-600 z-50 rounded-xl px-6 pb-6 transform transition-all duration-300 ${showAddProduct ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>

                {/* Header Section */}
                <div className='flex flex-col justify-start items-start py-6 border-b border-gray-100 dark:border-gray-600'>
                    <h2 className='text-xl font-semibold text-gray-800 dark:text-white'>Add New Product</h2>
                    <p className='text-xs text-gray-500 dark:text-gray-300 mt-1'>Fill in the details to add a new product to your inventory.</p>
                </div>

                {/* Form Section */}
                <div className='w-full mt-6 flex flex-col gap-5'>

                    {/* Product Name */}
                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-gray-800 dark:text-gray-200'>Product Name *</label>
                        <input
                            type="text"
                            className='w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 dark:text-gray-200 text-sm bg-white dark:bg-gray-600 transition-all duration-200'
                            placeholder='Enter product name'
                            required
                            name='productName'
                            onChange={handleInputChange}
                            value={formInput.productName || ''}
                        />
                    </div>

                    {/* Category */}
                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-gray-800 dark:text-gray-200'>Category *</label>
                        <select
                            name="category"
                            className='w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 dark:text-gray-200 text-sm bg-white dark:bg-gray-600 transition-all duration-200'
                            onChange={handleCategoryInput}
                            value={formInput.category}
                        >
                            <option value="">Select a category</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                            <option value="Other">Other</option>
                            {/* Add this line to show the custom category as an option when it exists */}
                            {otherCategory && !categories.includes(otherCategory) && (
                                <option value={otherCategory}>{otherCategory}</option>
                            )}
                        </select>

                        {/* Other Category Input */}
                        <div className={`w-full flex gap-2 items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 transition-all duration-300 ${openOtherInput ? 'block' : 'hidden'}`}>
                            <input
                                type="text"
                                className='flex-1 bg-transparent focus:outline-none text-gray-700 dark:text-gray-200 text-sm placeholder-gray-400 dark:placeholder-gray-300'
                                placeholder='Enter custom category'
                                value={otherCategory}
                                onChange={(e) => setOtherCategory(e.target.value)}
                            />
                            <div className='flex items-center gap-2'>
                                <button
                                    type="button"
                                    className='p-1 hover:bg-green-100 dark:hover:bg-green-800 rounded-full transition-colors duration-200'
                                    onClick={() => { setFormInput({ ...formInput, 'category': otherCategory }); setOpenOtherInput(false) }}
                                >
                                    <IoIosSend className='text-green-600 dark:text-green-400' size={16} />
                                </button>
                                <button
                                    type="button"
                                    className='p-1 hover:bg-red-100 dark:hover:bg-red-800 rounded-full transition-colors duration-200'
                                    onClick={() => { setOpenOtherInput(false); setOtherCategory('') }}
                                >
                                    <MdOutlineCancel className='text-red-600 dark:text-red-400' size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Price Fields */}
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-800 dark:text-gray-200'>Cost Price *</label>
                            <input
                                type="number"
                                className='w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 dark:text-gray-200 text-sm bg-white dark:bg-gray-600 transition-all duration-200'
                                placeholder='0.00'
                                required
                                name='costPrice'
                                onChange={handleInputChange}
                                value={formInput.costPrice || ''}
                            />
                        </div>

                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-800 dark:text-gray-200'>Selling Price *</label>
                            <input
                                type="number"
                                className='w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 dark:text-gray-200 text-sm bg-white dark:bg-gray-600 transition-all duration-200'
                                placeholder='0.00'
                                required
                                name='sellingPrice'
                                onChange={handleInputChange}
                                value={formInput.sellingPrice || ''}
                            />
                        </div>
                    </div>

                    {/* Items */}
                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-gray-800 dark:text-gray-200'>Items in Stock *</label>
                        <input
                            type="number"
                            className='w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 dark:text-gray-200 text-sm bg-white dark:bg-gray-600 transition-all duration-200'
                            placeholder='Enter quantity'
                            required
                            name="items"
                            onChange={handleInputChange}
                            value={formInput.items || ''}
                        />
                    </div>

                    {/* Image Upload */}
                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-gray-800 dark:text-gray-200'>Product Image</label>
                        <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200'>
                            <Button
                                color="indigo"
                                variant="soft"
                                className='w-full hover:cursor-pointer py-3'
                                onClick={() => fileInputRef.current.click()}
                            >
                                📷 Upload Image
                            </Button>
                            <input type="file" ref={fileInputRef} className='hidden' onChange={handleImageInput} name='image' accept="image/*" />
                        </div>
                        {formInput.image && (
                            <div className='flex items-center justify-between gap-2 p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg'>
                                <div className='text-sm text-green-800 dark:text-green-200 truncate'>{formInput.image.name}</div>
                                <button
                                    type="button"
                                    className='p-1 hover:bg-red-100 dark:hover:bg-red-800 rounded-full transition-colors duration-200'
                                    onClick={() => setFormInput({ ...formInput, 'image': null })}
                                >
                                    <MdOutlineCancel className='text-red-600 dark:text-red-400' size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Icon Upload */}
                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-gray-800 dark:text-gray-200'>Product Icon</label>
                        <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200'>
                            <Button
                                color="indigo"
                                variant="soft"
                                className='w-full hover:cursor-pointer py-3'
                                onClick={() => fileIconRef.current.click()}
                            >
                                🎨 Upload Icon
                            </Button>
                            <input type="file" ref={fileIconRef} className='hidden' onChange={handleImageInput} name='icon' accept="image/*" />
                        </div>
                        {formInput.icon && (
                            <div className='flex items-center justify-between gap-2 p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg'>
                                <div className='text-sm text-green-800 dark:text-green-200 truncate'>{formInput.icon.name}</div>
                                <button
                                    type="button"
                                    className='p-1 hover:bg-red-100 dark:hover:bg-red-800 rounded-full transition-colors duration-200'
                                    onClick={() => setFormInput({ ...formInput, 'icon': null })}

                                >
                                    <MdOutlineCancel className='text-red-600 dark:text-red-400' size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className='flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-600'>
                        <button
                            type="button"
                            className='px-6 py-2.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200 font-medium'
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className='px-6 py-2.5 bg-gray-700 dark:bg-gray-800 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-900 transition-colors duration-200 font-medium shadow-md hover:shadow-lg'
                            onClick={handleSubmit}
                        >
                            Add Product
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddProduct