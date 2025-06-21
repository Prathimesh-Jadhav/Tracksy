import React, { useEffect } from 'react'
import product1 from '../assets/product1.png'
import { GoPlusCircle } from "react-icons/go";
import { toast } from 'react-toastify';

const sellProductCard = ({ product, productsData, setSelectedItems, selectedItems }) => {
    

    const handleSubmit = (e) => {
        //select the entire product card:
        const ele = e.target.closest('.sellProductCard');
        const index = ele.getAttribute('data-index');
        const inputValue = ele.querySelector('input').value;

        if (inputValue <= 0) {
            toast.error('Please enter a valid quantity');
            return;
        }

        if(inputValue>product?.items){
            toast.error('No Enough Items');
            return;
        }

        const item = {
            ...product,
            quantity: Number(inputValue),
        }

        setSelectedItems([...selectedItems, item])

        ele.querySelector('input').value = '';

    }

    return (
        <div className='w-full border dark:border-gray-600 rounded-lg mt-3 p-2 grid md:grid-cols-[2fr,1fr,1fr,1fr] max-md:grid-cols-[1fr,1fr,1fr] gap-4 sellProductCard animate' key={product.productId} data-index={product.productId}>
            {/* Product*/}
            <div className='flex justify-start items-center gap-2'>
                <div className='max-w-11 max-h-11 min-w-11 min-h-11 rounded-xl border flex items-center justify-center max-md:hidden overflow-hidden'><img src={`${import.meta.env.VITE_BASE_URL}/${product.image}` || product1} alt="" className='object-cover' /></div>
                <div className='flex flex-col items-start justify-start'>
                    <p className='text-md break-all'>{product.productName}</p>
                    <div className='flex items-center justify-start gap-1'>
                        <p className='text-xs text-gray-500 max-md:hidden'>{product.category}</p>
                        <div className='rounded-full h-1 w-1 bg-gray-500 max-md:hidden'></div>
                        <p className='text-xs text-gray-500'>{product.items} left</p>
                    </div>
                </div>
            </div>

            {/* Price  */}
            <div className='flex justify-start items-center max-md:hidden'>
                <p className='text-md text-gray-600 dark:text-gray-200'>Rs.{product.sellingPrice}</p>
            </div>

            {/* Enter Items  */}
            <div className='flex justify-center items-center'>
                <input type="Number" className='focus:outline-none py-1 px-2 rounded-lg text-sm md:max-w-[120px] max-md:max-w-[80px] border-2 dark:bg-gray-800 dark:border-gray-600' placeholder='Enter Quantity' />
            </div>

            <div className='flex justify-center items-center'>
                <button className='py-1 px-1 rounded-full text-green-800 hover:scale-105 transition-all duration-150 hover:bg-green-400 hover:text-white flex justify-center items-center' onClick={handleSubmit}>
                    <GoPlusCircle size={23} />
                </button>
            </div>
        </div>
    )
}

export default sellProductCard
