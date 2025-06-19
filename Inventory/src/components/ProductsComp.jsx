import React, { useEffect, useState } from 'react'
import { Edit, Eye } from 'lucide-react';
import product1 from '../assets/product1.png';
import { MdDelete } from "react-icons/md";
import { FiMinusCircle } from "react-icons/fi";
import { IoAddCircleOutline } from "react-icons/io5";
import { HiOutlineMinusCircle } from "react-icons/hi2";
import axios from 'axios';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from './DeleteConfirmationModal';


const ProductsComp = ({ setDeleteProduct, onConfirmDelete, setOpenDeleteModal,product, isOpen, setIsOpen, getAllProducts, setEditProductDetails }) => {



    const openEditMenu = () => {
        setTimeout(setIsOpen(!isOpen), 100); // Delay to allow the menu to open before setting the product details
    }

    useEffect(() => {
        setEditProductDetails(product);
    }, []);

    const handleDelete = async () => {
        if (!onConfirmDelete) {
            setOpenDeleteModal(true);
            setDeleteProduct(product);
            return;
        }
    }


    return (
        <div className='animate w-full p-2 rounded-lg border dark:border-gray-600 grid md:grid-cols-[2fr,1fr,1fr,1fr,1fr] max-md:grid-cols-[1fr,1fr,1fr] gap-2' key={product.productId} data-index={product.productId}>
            {/* Product*/}
            <div className='flex justify-start items-center gap-2'>
                <div className='max-w-11 max-h-11 min-w-11 min-h-11 rounded-xl border dark:border-gray-600 flex items-center justify-center max-md:hidden overflow-hidden'><img src={`${import.meta.env.VITE_BASE_URL}/${product.image?.replace(/\\/g, '/')}`} alt="" className='object-cover' /></div>
                <div className='flex flex-col items-start justify-start'>
                    <p className='text-md break-all'>{product?.productName}</p>
                    <div className='flex items-center justify-start gap-1'>
                        <p className='text-xs text-gray-500'>{product.category}</p>
                    </div>
                </div>
            </div>

            {/* Price  */}
            <div className='flex items-center justify-start max-md:hidden'>
                <p className='text-md text-center text-gray-600 dark:text-white'>{product.sellingPrice}</p>
            </div>

            {/* Stock */}
            <div className='flex items-center md:justify-start max-md:justify-center w-full'>
                <p className='text-md max-md:text-center md:text-start text-gray-600 w-full dark:text-white'>{product.items}</p>
            </div>

            {/* last added date */}
            <div className='flex items-center justify-start max-md:hidden'>
                <p className='text-md text-center text-gray-600 dark:text-white '>{product.updatedAt.split('T')[0]}</p>
            </div>

            {/* action  */}
            <div className='flex items-center justify-center edit-menu w-full'>

                <div className='flex items-center'>
                    <button className={`p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 transition-colors duration-200 ${isOpen ? 'hidden' : 'block'}`} onClick={openEditMenu}>
                        <Edit size={16} />
                    </button>
                    <button className={`p-2 rounded-lg text-red-400 hover:text-red-600 transition-colors duration-200 hover:scale-110 ${isOpen ? 'hidden' : 'block'}`} onClick={handleDelete}>
                        <MdDelete size={23} />
                    </button>
                </div>

            </div>



        </div>
    )
}

export default ProductsComp
