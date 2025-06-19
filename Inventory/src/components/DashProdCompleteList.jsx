import React from 'react'
import { MdCurrencyRupee } from "react-icons/md";

const DashProdCompleteList = ({ lowStockProducts }) => {
    return (
        <div className="w-full">
            <div className="flex flex-col gap-2 px-3 py-3 min-h-[325px] w-full ">
                {lowStockProducts.length==0 ? <p className='text-md text-gray-500 dark:text-white self-center flex justify-center items-center min-h-[300px]  w-full'>No products found</p> : lowStockProducts.map((product) => (
                    <div key={product.id} className="p-2 px-3 rounded-lg transition-shadow border-2 dark:border-gray-400 flex items-start gap-3 justify-start ">
                        <div className='h-9 w-9 border-2 rounded-full'></div>
                        <div className='flex  items-start justify-between gap-1 w-full'>
                            <div className='flex flex-col items-start justify-start'>
                                <h4 className='text-sm text-black dark:text-white text-start max-sm:max-w-[90px]'>{product.name}</h4>
                                <div className='flex items-center justify-start gap-1 '>
                                    <div className='text-xs max-md:hidden'>{product.category}</div>
                                    <div className='w-1 h-1 rounded-full bg-gray-500 mt-[1px] max-md:hidden'></div>
                                    <div className={`text-xs ${product.stock <= 5 ? 'text-red-600' : 'text-green-700'}`}>{product.stock} items left</div>
                                </div>
                            </div>
                            <div className='text-md text-black dark:text-white self-center flex justify-start items-center min-w-[60px]'>{product.price} <span className='text-sm'><MdCurrencyRupee /></span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DashProdCompleteList
