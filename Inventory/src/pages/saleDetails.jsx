import React from 'react'
import { GlobalContext } from '../context/AppContext';
import { IoMdArrowBack } from "react-icons/io";
import { RiCurrencyFill } from "react-icons/ri";
import { MdOutlinePersonOutline } from "react-icons/md";
import { MdOutlineAddIcCall } from "react-icons/md";
import { CiCalendarDate } from "react-icons/ci";
import { Table } from '@radix-ui/themes/dist/cjs/index.js';
import { useNavigate } from 'react-router-dom';

const saleDetails = () => {
  const { saleDetails } = React.useContext(GlobalContext);
  
  const navigate = useNavigate();

  const handleNavigate=()=>{
      navigate('/layout/sales');
  }

  const calculateTotalItems = (products)=>{

    let sum =0;
    products.forEach((product)=>{
        sum+=product.quantity;
    })

    return sum;
     
  }

  return (
    <div className='w-full px-8 max-md:px-4 py-6 md:max-h-[90vh] overflow-y-auto remove-scroll min-h-[70vh]'>
      <div className='flex items-center justify-start gap-3'>
        <div className='min-h-9 min-w-9 border-2 rounded-lg flex items-center justify-center hover:bg-gray-100 hover:cursor-pointer' onClick={handleNavigate}>
          <IoMdArrowBack size={24} />
        </div>
        <div>
          <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>Sale Details</h1>
          <p className='text-gray-600 dark:text-gray-400 text-sm'>See Details of selected Sale.</p>
        </div>
      </div>

      <div className='flex flex-col mt-8 bg-gray-50 p-4 rounded-lg'>
        <div className='w-full flex justify-start items-center gap-3'>
          <div className='font-bold'>Sale Information</div>
        </div>

        <div className='w-full grid md:grid-cols-4 max-md:grid-cols-1 justify-start items-center py-4'>
          <div className='flex items-center justify-start gap-2'>
            <div className='h-9 w-9 border-2 rounded-lg flex items-center justify-center bg-blue-200 text-blue-700'><RiCurrencyFill /></div>
            <div className='flex flex-col'>
              <p className='text-xs'>Sale Id</p>
              <p className='font-medium'>{saleDetails && saleDetails[0]?.saleID}</p>
            </div>
          </div>
          <div className='flex items-center justify-start gap-2 max-md:mt-4'>
            <div className='h-9 w-9 border-2 rounded-lg flex items-center justify-center bg-violet-300 text-violet-700'><MdOutlinePersonOutline /></div>
            <div className='flex flex-col'>
              <p className='text-xs'>CustomerName</p>
              <p className='font-medium'>{saleDetails && saleDetails[0]?.customerName}</p>
            </div>
          </div>
          <div className='flex items-center justify-start gap-2 max-md:mt-4'>
            <div className='h-9 w-9 border-2 rounded-lg flex items-center justify-center bg-red-300 text-red-700'><MdOutlineAddIcCall /></div>
            <div className='flex flex-col'>
              <p className='text-xs'>Mobile</p>
              <p className='font-medium'>{saleDetails && saleDetails[0]?.mobileNumber}</p>
            </div>
          </div>
          <div className='flex items-center justify-start gap-2 max-md:mt-4'>
            <div className='h-9 w-9 border-2 rounded-lg flex items-center justify-center bg-green-300 text-green-700'><CiCalendarDate size={20} /></div>
            <div className='flex flex-col'>
              <p className='text-xs'>sold Date</p>
              <p className='font-medium'>{ saleDetails && saleDetails[0]?.updatedAt.split('T')[0]}</p>
            </div>
          </div>
        </div>

      </div>


      <div className='border rounded-lg mt-8'>
        <div className='w-full flex justify-start items-center gap-3 p-4'>
          <div className='font-medium text-gray-800 text-xl'>Sold Items</div>
        </div>
        <Table.Root size="3" className=''>
          <Table.Header>
            <Table.Row className="text-sm">
              <Table.ColumnHeaderCell className='max-md:hidden'>Product Id</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell >Product Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Items</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className='max-md:hidden'>Unit Price</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Total Amount</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
          { 
            saleDetails && saleDetails[0]?.soldProducts.map((product,index)=>(
            <Table.Row className="text-sm">
              <Table.Cell className='max-md:hidden'>{product.productId}</Table.Cell>
              <Table.Cell>{product.productName}</Table.Cell>
              <Table.Cell>{product.quantity}</Table.Cell>
              <Table.Cell className='max-md:hidden'>₹{product.sellingPrice}</Table.Cell>
              <Table.Cell>₹{product.sellingPrice * Number(product.quantity)}</Table.Cell>
            </Table.Row>
            ))
         }
          </Table.Body>
        </Table.Root>
      </div>

      <div className='border rounded-lg mt-6 p-4'>
        <div className='font-medium text-gray-800 text-xl'>Sale Summary</div>
        <div className='w-full grid md:grid-cols-3 max-md:grid-cols-1 justify-start items-center gap-4 mt-4'>
          <div className='flex flex-col justify-center items-center p-2 bg-red-200 rounded-lg'>
            <div className='text-4xl font-bold'>{saleDetails && calculateTotalItems( saleDetails[0]?.soldProducts)}</div>
            <p className='text-sm'>Items</p>
          </div>
          <div className='flex flex-col justify-center items-center p-2 bg-blue-200 rounded-lg'>
            <div className='text-4xl font-bold'>{ saleDetails &&saleDetails[0].soldProducts?.length}</div>
            <p className='text-sm'>Product Types</p>
          </div>
          <div className='flex flex-col justify-center items-center p-2 bg-violet-200 rounded-lg'>
            <div className='text-4xl font-bold text-green-700'>{saleDetails && saleDetails[0].amountPaid}</div>
            <p className='text-sm'>Total Amount</p>
          </div>
        </div>

        <hr className=' mt-4 border-gray-200' />
        <div className='flex flex-col'>
          <div className='flex justify-between p-2 mt-2'>
            <div>Total:</div>
            <div className='font-bold'>{saleDetails && saleDetails[0].totalAmount}</div>
          </div>
          <div className='flex justify-between p-2'>
            <div>Discount:</div>
            <div className='font-bold'>{ saleDetails && saleDetails[0].discount}</div>
          </div>
          <div className='flex justify-between p-2 border-t-[1px]'>
            <div>Net Amount:</div>
            <div className='text-xl text-green-600 font-bold'>{saleDetails && saleDetails[0].amountPaid}</div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default saleDetails
