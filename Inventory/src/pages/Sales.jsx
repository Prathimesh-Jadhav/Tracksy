import React, { useState, useEffect } from 'react'
import { salesData } from '../data/LandComments'
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import DateRange from '../components/DateRange';
import { CiSearch } from 'react-icons/ci';
import dayjs from 'dayjs';
import { GlobalContext } from '../context/AppContext';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { Pagination } from '@mui/material';

const Sales = () => {
    const [salesData, setSalesData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredSales, setFilteredSales] = useState([]);
    const { setSelectedOption, setSaleDetails, saleDetails,darkMode } = React.useContext(GlobalContext);
    const [loading, setLoading] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [onConfirmDelete, setOnConfirmDelete] = useState(false);
    const [deleteProduct, setDeleteProduct] = useState('');
    const [pagesCount,setPagesCount] = useState(1);
    const [currentSales, setCurrentSales] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        setSelectedOption('sales');
        getAllSales();
    }, []);

    useGSAP(() => {
        gsap.from('.animate', { y: 50, opacity: 0, duration: 0.7, ease: 'power2.out', stagger: 0.2 });
    }, [])

    const getAllSales = async () => {

        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/salesRoutes/getSales`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            setSalesData(response.data);
            setFilteredSales(response.data);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            }
            else {
                console.error('Error fetching sales data:', error);
                toast.error('Failed to fetch sales data');
            }
        }
    };

    useEffect(() => {
        let filtered = salesData;

        // Filter by search text
        if (searchText.trim() !== '') {
            filtered = filtered.filter(sale =>
                sale.customerName.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Filter by date range in DD/MM/YYYY
        if (startDate && endDate) {
            const start = dayjs(startDate, 'DD/MM/YYYY');
            const end = dayjs(endDate, 'DD/MM/YYYY');

            filtered = filtered.filter(sale => {
                const saleDate = dayjs(sale.updatedAt.split('T')[0]);
                return saleDate.isAfter(start.subtract(1, 'day')) && saleDate.isBefore(end.add(1, 'day'));
            });
        }

        setFilteredSales(filtered);
    }, [searchText, startDate, endDate]);


    const handleDateChange = ({ startDate, endDate }) => {
        setStartDate(startDate);
        setEndDate(endDate);
    };

    useEffect(() => {
        setFilteredSales(filteredSales.sort((a, b) => new Date(b.soldDate) - new Date(a.soldDate)));
    }, [filteredSales]);

    const moveSaleDetails = (e) => {
        if (e.target.closest('.delete')) return;
        const dataIndex = e.target.closest('.animate').getAttribute('data-index');
        console.log(dataIndex)
        setSaleDetails(filteredSales.filter((ele, index) => {
            return ele.saleID == dataIndex;
        }));
        setTimeout(() => {
            navigate('saleDetails');
        }, 100)
    }

    const handleDeleteSale = async (e) => {
        e.stopPropagation();
        const saleId = e.target.closest('.animate').getAttribute('data-index');
        const sale = filteredSales.find(sale => sale.saleID === saleId);
        if (!sale) {
            toast.error('Sale not found');
            return;
        }
        setDeleteProduct(sale);
        setOpenDeleteModal(true);
    }

    useEffect(() => {
        if (!onConfirmDelete) return;

        setTimeout(async () => {
            try {
                const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/salesRoutes/deleteSales/${deleteProduct.saleID}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
                toast.success(res.data.message);
                getAllSales();
            } catch (err) {
                if (err.response && err.response.data && err.response.data.message) {
                    toast.error(err.response.data.message);
                }
                else {
                    toast.error("Something went wrong");
                }
            }
            setOpenDeleteModal(false);
            setOnConfirmDelete(false);
        }, 100);
    }, [onConfirmDelete, deleteProduct]);

    const handlePageChange = (event, value) => {
        const salesPerPage = 7;
        const startIndex = (value - 1) * salesPerPage;
        const endIndex = startIndex + salesPerPage;
        const paginatedSales = filteredSales.slice(startIndex, endIndex);
        setCurrentSales(paginatedSales);
    }


    useEffect(()=>{
         const salesperpage = 7;
         const totalPages = filteredSales.length/salesperpage;
         setPagesCount(Math.ceil(totalPages));
        const paginatedSales = filteredSales.slice(0, salesperpage);
        setCurrentSales(paginatedSales);
    },[ filteredSales]);


    return (
        <div className='w-full px-8 max-md:px-4 py-6 md:max-h-[90vh] overflow-y-auto remove-scroll min-h-[70vh]'>
            <div className='w-full animate'>
                <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>Sales</h1>
                <p className='text-gray-600 dark:text-gray-400 text-sm'>Checkout What you have sold so far.</p>
            </div>

            {/* searchbar */}
            <div className='w-full mt-6 grid md:grid-cols-[2fr_1fr] items-center justify-between max-md:grid-cols-1 gap-4 animate'>
                <div className='w-full border dark:border-gray-600 rounded-lg mt-2 overflow-hidden flex items-center relative'>
                    <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full py-2 px-3 focus:outline-none text-sm text-gray-700 dark:bg-black"
                        placeholder='Select Product to Add in Bill'
                    />
                    <div className='px-2 bg-gray-100 hover:bg-gray-200 absolute top-0 right-0 bottom-0 flex items-center justify-center'>
                        <CiSearch size={23} className='text-2xl cursor-pointer dark:text-gray-700' />
                    </div>
                </div>
                <div>
                    <DateRange onDateChange={handleDateChange} setStartDate={setStartDate} setEndDate={setEndDate} startDate={startDate} endDate={endDate} />
                </div>
            </div>

            {/* sales list */}
            <div className='mt-10 min-h-[52vh] '>
                <div className='h-10 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 border-b-[1px] dark:border-gray-600 border-t-[1px] md:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] grid grid-cols-[1fr_1fr_1fr] items-center justify-center text-gray-500 text-sm animate'>
                    <div className='pl-2 max-md:hidden'>Sale ID</div>
                    <div>Customer Name</div>
                    <div className='max-md:text-center'>MobileNumber</div>
                    <div className='max-md:hidden'>Sold Date</div>
                    <div className='max-md:hidden'>Paid Amount</div>
                    <div className='flex items-center gap-2 justify-center'>Action</div>
                </div>

                {
                    loading ? (<div className='h-12 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 flex items-center justify-center animate'>Fetching Products...</div>) :
                        currentSales.length <= 0 ? <div className='h-12 bg-red-50 mt-2 text-gray-700 dark:text-gray-400 dark:border-gray-600 flex items-center justify-center animate'>No Sales Found</div> : currentSales.map((sale, index) => (
                            <>
                            <div className='h-12 border-b-[1px] dark:border-gray-600 grid md:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] max-md:grid-cols-[1fr_1fr_1fr] max-md:gap-4 items-center justify-center text-sm hover:bg-gray-50 dark:hover:bg-gray-700 hover:cursor-pointer animate' key={sale.saleID} onClick={moveSaleDetails} data-index={sale.saleID}>
                                <div className='pl-2 max-md:hidden'>{sale.saleID}</div>
                                <div className='flex items-center gap-2'>
                                    <div className='w-6 h-6 rounded-lg border-2'>
                                        <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="" />
                                    </div>
                                    {sale.customerName}
                                </div>
                                <div>{sale.mobileNumber}</div>
                                <div className='max-md:hidden'>{sale.updatedAt.split('T')[0]}</div>
                                <div className='max-md:hidden'>{sale.amountPaid} <span className='text-xs'>Rs</span></div>
                                <div className='flex gap-2 items-center justify-center'>
                                    <div className='text-blue-500 hover:text-blue-700 hover:scale-110'><MdOutlineRemoveRedEye size={20} /></div>
                                    <div className='text-red-500 hover:text-red-700 hover:scale-110 delete' onClick={handleDeleteSale}><MdDelete size={20} /></div>
                                </div>
                            </div>
                            </>
                        ))}
            </div>

                        <div className='w-full flex justify-center items-center mt-6 z-10'>
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

            <DeleteConfirmationModal openDeleteModal={openDeleteModal} setOpenDeleteModal={setOpenDeleteModal} setOnConfirmDelete={setOnConfirmDelete} title="Delete Sale" message="Are you sure you want to delete this sale?" confirmText="Delete" cancelText="Cancel" itemName={deleteProduct?.saleID} />
        </div>
    );
};

export default Sales;
