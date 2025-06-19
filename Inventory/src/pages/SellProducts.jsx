import React, { useEffect, useState } from 'react'
import { IoIosPerson } from "react-icons/io";
import { BiSolidContact } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import SellProductCard from '../components/sellProductCard';
import { LiaRupeeSignSolid } from "react-icons/lia";
import { productsData } from '../data/LandComments';
import sellProductCard from '../components/sellProductCard';
import { SearchCheck } from 'lucide-react';
import { Pagination } from '@mui/material';
import { AiFillDelete } from "react-icons/ai";
import { toast } from 'react-toastify';
import { GlobalContext } from '../context/AppContext';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';

const SellProducts = () => {
    const [productsData, setProductsData] = useState([]);
    const [searchedProducts, setSearchedProducts] = useState([])
    const [pagesCount, setPagesCount] = useState(1);
    const [currentProducts, setCurrentProducts] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [netAmount, setNetAmount] = useState(0);
    const [discount, setDiscount] = useState('');
    const [recievedCash, setRecievedCash] = useState(false);
    const [custName, setCustName] = useState('');
    const [custMobNumber, setCustMobNumber] = useState();
    const { darkMode, setSelectedOption } = React.useContext(GlobalContext);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        setSelectedOption('sellProduct')
        getAllProducts();
    }, [])

    useEffect(() => {
        setSearchedProducts(productsData);
    }, [productsData])

    const getAllProducts = async () => {
        try {
            setFetching(true);
            const allProducts = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/productRoutes/getProducts`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            setProductsData(allProducts.data);
        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            }
            else {
                toast.error("Something went wrong");
            }
        }
        finally {
            setFetching(false);
        }
    }

    useGSAP(() => {
        gsap.from('.animate', { y: 50, opacity: 0, duration: 0.7, ease: 'power2.out', stagger: 0.2 });
        gsap.from('.animate1', { y: 50, opacity: 0, duration: 0.7, ease: 'power2.out', stagger: 0.2 });
    }, []);


    const updateProducts = async () => {

        const updatedProduts = selectedItems.map((item) => {
            return {
                productId: item.productId,
                items: item.items - item.quantity
            }
        })

        try {
            const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/productRoutes/updateProducts`, updatedProduts, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            console.log("Products Updated", response.data);
            return true;
        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            }
            else {
                toast.error("Something went wrong");
            }
            return false;
        }
    }

    const handleSubmitNow = async () => {

        if (!custName || !custMobNumber || selectedItems.length <= 0) {
            toast.error('Please fill all the fields');
            return;
        }

        if (custMobNumber.length !== 10) {
            toast.error('Please enter a valid mobile number');
            return;
        }

        //create a payload:
        const payLoad = {
            customerName: custName,
            mobileNumber: custMobNumber,
            soldProducts: selectedItems,
            totalAmount: totalPrice,
            discount: Math.ceil((discount / 100) * totalPrice),
            amountPaid: netAmount
        }

        setLoading(true);

        //send to backend
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/salesRoutes/addSale`, payLoad, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`
                }
            })

            const result = await updateProducts();
            if (!result) {
                await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/salesRoutes/deleteSales/${response.data._id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem('token')}`
                    }
                })
                toast.error('Something went wrong, Sale Deleted');
            }
            else {
                toast.success('Items sold Successfully');
                setCustMobNumber('');
                setCustName('');
                setSelectedItems([]);
            }

        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            }
            else {
                toast.error("Something went wrong");
            }
        } finally {
            setLoading(false);
        }

        getAllProducts();

    }


    const handleSearch = (e) => {
        const searchedProducts = productsData.filter((product) => {
            return product.productName.toLowerCase().includes(e.target.value.toLowerCase());
        })
        setSearchedProducts(searchedProducts)
    }

    useEffect(() => {
        setPagesCount(Math.ceil(searchedProducts.length / 4))
        setCurrentProducts(searchedProducts.slice(0, 4))
    }, [searchedProducts])


    const handlePageChange = (event, value) => {
        // Update the current page state
        setCurrentProducts(searchedProducts.slice((value - 1) * 4, value * 4));
        console.log(`Page changed to: ${value}`);
    };


    //calculate Total Price:
    useEffect(() => {
        let totalPrice = 0;
        selectedItems.forEach((item) => {
            totalPrice += item.sellingPrice * item.quantity;
        })
        setTotalPrice(Math.floor(totalPrice));
    }, [selectedItems])

    //calculate Net Amount:
    useEffect(() => {
        let netAmount = 0;
        netAmount = totalPrice - (totalPrice * discount / 100);
        setNetAmount(Math.floor(netAmount));
    }, [totalPrice, discount])


    //remove seleted Product:
    const removeSelectedProduct = (e) => {
        const ele = e.target.closest('.selected-Product');
        const index = ele.getAttribute('data-index');
        setSelectedItems(selectedItems.filter((item, i) => i !== Number(index)));
        console.log(index);
    }




    return (
        <div className='w-full px-8 max-md:px-4 py-6 md:max-h-[90vh] overflow-y-auto remove-scroll min-h-[90vh]'>
            <div className='animate'>
                <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>Sell Product</h1>
                <p className='text-gray-600 dark:text-gray-400 text-sm'>Make a bill and sell product to customers.</p>
            </div>

            {/* main Container  */}
            <div className='w-full grid xl:grid-cols-[3fr,1fr] max-xl:grid-cols-1 gap-2 mt-4'>
                {/* bill  */}
                <div className='w-full rounded-lg border dark:border-gray-600 px-1 py-2'>
                    {/* Customer Summary  */}
                    <div className='w-full mt-2 rounded-lg  px-2 py-1'>
                        <h1 className='text-gray-700 px-1 dark:text-gray-200'>Customer Details</h1>
                        <div className='w-full grid md:grid-cols-[1fr,1fr] mt-2 gap-2 max-md:grid-cols-1 animate'>
                            <div className='border dark:border-gray-600 px-2 py-2 rounded-lg flex items-center gap-2 '>
                                <IoIosPerson className='text-xl text-gray-600 dark:text-gray-400' />
                                <input type="text" className='focus:outline-none text-sm dark:bg-black' placeholder='Enter Customer Name' value={custName} onChange={(e) => setCustName(e.target.value)} />
                            </div>
                            <div className='border dark:border-gray-600 px-2 py-2 rounded-lg w-full flex items-center gap-2 '>
                                <BiSolidContact className='text-xl text-gray-600' />
                                <input type="text" className='focus:outline-none text-sm dark:bg-black' placeholder='Enter Mobile Number' value={custMobNumber} onChange={(e) => setCustMobNumber(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Select Products  */}
                    <div className='w-full mt-4 rounded-lg  px-2 py-1'>
                        <h1 className='text-gray-700 px-1 dark:text-gray-200 animate'>Select Products</h1>
                        {/* search bar  */}
                        <div className='w-full border dark:border-gray-600 rounded-lg mt-2 overflow-hidden flex items-center relative animate'>
                            <input type="text" className="w-full py-2 px-3 focus:outline-none text-sm text-gray-700 dark:bg-black" placeholder='Select Product to Add in Bill' onChange={handleSearch} />
                            <div className='px-2 bg-gray-300 hover:bg-gray-400 absolute top-0 right-0 bottom-0 flex items-center justify-center'>
                                <CiSearch size={23} className='text-2xl cursor-pointer  dark:text-gray-800' />
                            </div>
                        </div>

                        {/* products  */}
                        <div className='w-full max-h-[350px] overflow-y-auto remove-scroll animate'>
                            <div className='border-t-[1px] border-b-[1px] mt-4 h-8 bg-gray-100 dark:bg-gray-800 dark:border-gray-600 grid md:grid-cols-[2fr,1fr,1fr,1fr] max-md:grid-cols-[1fr,1fr,1fr] px-2 gap-4'>
                                <div className='flex justify-start items-center gap-2'>Product</div>
                                <div className='flex justify-start items-center gap-2 max-md:hidden'>Price</div>
                                <div className='flex justify-center items-center gap-2'>Quantity</div>
                                <div className='flex justify-center items-center gap-2'>Action</div>
                            </div>
                            {
                                fetching ? <p className='text-md text-gray-700 dark:text-white self-center flex justify-center items-center p-4 rounded-lg bg-red-50 mt-2  w-full'>Fetching Products...</p> :
                                currentProducts.length <=0 ? <p className='text-md text-gray-700  self-center flex justify-center items-center p-4 rounded-lg bg-red-50 mt-2  w-full'>No products found</p> : currentProducts.map((product, index) => (
                                    <SellProductCard product={product} index={index} productsData={productsData} setSelectedItems={setSelectedItems} selectedItems={selectedItems} />
                                ))
                            }

                            <div className='w-full flex justify-center items-center mt-6'>
                                {
                                    darkMode ?
                                        <Pagination count={pagesCount} variant="outlined" shape="rounded" onChange={handlePageChange}
                                            sx={{
                                                '& .MuiPaginationItem-root': {
                                                    color: '#fff',                 // text color
                                                    borderColor: '#555',           // border for outlined
                                                    backgroundColor: '#1f1f1f',    // background
                                                },
                                                '& .Mui-selected': {
                                                    backgroundColor: '##dfdfdf',    // selected item background
                                                    color: '#fff',                 // selected item text
                                                    borderColor: '#fff',
                                                },
                                                '& .MuiPaginationItem-root:hover': {
                                                    backgroundColor: '#333',
                                                },
                                            }}
                                        /> :
                                        <Pagination count={pagesCount} variant="outlined" shape="rounded" onChange={handlePageChange}
                                            sx={{
                                                '& .MuiPaginationItem-root': {
                                                    color: '#000',                 // text color
                                                    borderColor: '#555',           // border for outlined
                                                    backgroundColor: '#fff',    // background
                                                },
                                                '& .Mui-selected': {
                                                    backgroundColor: '#ccc',    // selected item background
                                                    color: '#000',                 // selected item text
                                                    borderColor: '#ccc',
                                                },
                                                '& .MuiPaginationItem-root:hover': {
                                                    backgroundColor: '#ccc',
                                                },
                                            }}
                                        />
                                }

                            </div>

                        </div>
                    </div>


                </div>

                {/* bill Summary  */}
                <div className='rounded-lg border dark:border-gray-600 xl:min-h-[78vh] px-3 relative max-md:min-h-[600px]'>
                    <h1 className='text-gray-700  pt-4 pb-2 dark:text-gray-200 animate1'>Order Details</h1>
                    <div className='mt-2 w-full'>

                        <div className='w-full items-center min-h-[150px] max-h-[200px] overflow-y-auto remove-scroll rounded-lg animate1'>
                            {
                                selectedItems.length > 0 ? (
                                    selectedItems.map((product, index) => (
                                        <div className='py-2 px-2 grid grid-cols-[1fr,1fr,1fr] border-b-[1px] border-gray-200 dark:border-gray-500 selected-Product relative overflow-hidden group' key={index} data-index={index}>
                                            <div className='absolute top-0 bottom-0 left-0 right-0 hidden group-hover:block backdrop-blur-sm backdrop-opacity-80 bg-red-300 bg-opacity-40 z-20' onClick={removeSelectedProduct}>
                                                <div className='w-full flex justify-center items-center text-red-400 hover:text-red-500 hover:scale-110 hover:cursor-pointer border h-full'><AiFillDelete size={25} /></div>
                                            </div>
                                            <div className='text-gray-600 dark:text-gray-300 text-sm'>{product.productName}</div>
                                            <div className='text-gray-600 dark:text-gray-300 text-sm text-center'>x{product.quantity}</div>
                                            <div className='text-black dark:text-gray-200 font-medium text-sm text-end flex items-start justify-end'>{product.sellingPrice * product.quantity} <span><LiaRupeeSignSolid size={13} /></span></div>
                                        </div>
                                    ))
                                ) : (
                                    <div className='w-full flex justify-center items-center min-h-[150px] border dark:border-gray-500 rounded-lg'>
                                        <p className=' text-sm text-red-400'>No Product Selected</p>
                                    </div>
                                )
                            }
                        </div>


                        {/* dashed line  */}
                        <div className='w-full border-dashed border-2 mt-2 animate1'></div>
                        <div className='py-1 mt-1 flex justify-between items-center px-2 animate1'>
                            <div className='text-gray-600 text-sm dark:text-gray-400'>Total</div>
                            <div className='text-md font-bold flex justify-center items-center'>{totalPrice}<span><LiaRupeeSignSolid size={13} /></span></div>
                        </div>
                        <div className='py-1 flex justify-between items-center px-2 animate1'>
                            <div className='text-gray-600 text-sm dark:text-gray-400'>Discount</div>
                            <div className='text-sm font-medium text-gray-600 flex justify-center items-center'> <input type="text" value={discount} className='max-w-[50px] border border-gray-500 rounded-lg focus:outline-none px-2 dark:bg-gray-800' onChange={(e) => { setDiscount(Number(e.target.value)) }} /> %</div>
                        </div>
                        <div className='w-full border-dashed border-2 mt-2 animate1'></div>
                        <div className='py-1 mt-1 flex justify-between items-center px-2 animate1'>
                            <div className='text-gray-600 text-sm dark:text-gray-400'>Net Amount</div>
                            <div className='text-md font-bold flex justify-center items-center'>{netAmount}<span><LiaRupeeSignSolid size={13} /></span></div>
                        </div>

                        <div className='absolute bottom-2 right-2 left-2 animate1'>
                            <div className='flex items-center justify-start px-1 mb-2'>
                                <input type="checkbox" name="recievedCash" id="" onChange={(e) => setRecievedCash(!recievedCash)} className='dark:bg-gray-800' />
                                <label htmlFor="" className='text-sm text-gray-600 ml-2 dark:text-gray-400'>Recieved Cash from Customer</label>
                            </div>
                            {
                                loading ? (
                                    <div className={`rounded-lg h-10 bg-black dark:bg-white text-white dark:text-black flex justify-center items-center ${recievedCash ? 'cursor-pointer' : 'cursor-not-allowed'}`} >
                                        Submitting...
                                    </div>
                                ) : (
                                    <div className={`rounded-lg h-10 bg-black dark:bg-white text-white dark:text-black flex justify-center items-center ${recievedCash ? 'cursor-pointer' : 'pointer-events-none cursor-not-allowed'} animate1`} onClick={handleSubmitNow}>
                                        Submit Now
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SellProducts
