import React from 'react'
import DashProductsTable from './DashProductsTable'

const RecentBuyings = ({salesData}) => {
    return (
        <div className='w-full border-2 dark:border-gray-600 rounded-lg p-3'>
            <h3 className='text-lg font-semibold text-gray-700 dark:text-white'>Recent Sales</h3>
            <p className='text-sm text-gray-500 dark:text-gray-400'>See your recent sales</p>
            <div> 
                <DashProductsTable salesData={salesData}/>
            </div>
        </div>
    )
}

export default RecentBuyings
