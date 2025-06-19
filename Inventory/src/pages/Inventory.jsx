import React, { useEffect, useState } from 'react'
import { GoSearch } from "react-icons/go";
import { BiFilter } from "react-icons/bi";
import ProductsComp from '../components/ProductsComp';
import { createTheme, Pagination } from '@mui/material';
// import { productsData } from '../data/LandComments';
import AddProduct from '../components/AddProduct';
import { GlobalContext } from '../context/AppContext';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import EditProduct from '../components/EditProducts';
import axios from 'axios';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';


const Inventory = () => {
    const [openFilter, setOpenFilter] = useState(false);
    const { darkMode } = React.useContext(GlobalContext);
    const [productsData, setProductsData] = useState([]);
    const [filterOption, setFilterOption] = useState('All');
    const [pagesCount, setPagesCount] = useState(1);
    const [currentProducts, setCurrentProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState(productsData);
    const [options, setOptions] = useState({});
    const [showAddProduct, setShowAddProduct] = useState(false);
    const { setSelectedOption } = React.useContext(GlobalContext);
    const [editProductDetails, setEditProductDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [onConfirmDelete, setOnConfirmDelete] = useState(false);
    const [deleteProduct, setDeleteProduct] = useState('');


    useGSAP(() => {
        gsap.from('.animate', { y: 50, opacity: 0, duration: 0.7, ease: 'power2.out', stagger: 0.2 });
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            // Ensure we close only if click is outside the filter dropdown
            if (!e.target.closest('.filter')) {
                setOpenFilter(false);
            }
        };

        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [])

    useEffect(() => {
        setSelectedOption('inventory');
        getAllProducts();
    }, []);


    useEffect(() => {
        if (!onConfirmDelete) return;
        if (!openDeleteModal) return;

        setTimeout(async () => {
            console.log("deleteProduct", deleteProduct);
            try {
                const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/productRoutes/deleteProduct/${deleteProduct.productId}`
                    , {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem('token')}`
                        }
                    }
                );
                toast.success(res.data.message);
                getAllProducts();
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

    // Function to fetch all products from the server
    const getAllProducts = async () => {
        try {
            setLoading(true);
            // Fetch products from the API
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/productRoutes/getProducts`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            setProductsData(response.data);
            setFilteredProducts(response.data);
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
            setLoading(false);
        }
    }


    //sub filters of products :
    useEffect(() => {
        const handleSubFilters = (e) => {
            const categories = new Set(new Array(...productsData.map(product => product.category)));
            const prices = new Set(new Array(...productsData.map(product => product.sellingPrice)));
            const sortedPrices = Array.from(prices).sort((a, b) => a - b);
            const lastPrice = sortedPrices[sortedPrices.length - 1];
            let currentLastprice = 0;

            let pricesInRange = [];

            while (currentLastprice < lastPrice) {
                let lastPrice1 = `${currentLastprice}-${currentLastprice + 100}`;
                pricesInRange.push(lastPrice1);
                currentLastprice += 100;
            }

            setOptions({
                'Category': Array.from(categories),
                'Price': pricesInRange
            })

        }
        handleSubFilters();
    }, [productsData]);


    const darkTheme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
    });


    //all related to pagination:
    useEffect(() => {
        //set Page count for pagination based on productsData length
        const handlePagesCount = () => {
            const itemsPerPage = 5; // Adjust this value as needed
            const totalItems = filteredProducts.length; // Assuming productsData is your array of products
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            setPagesCount(totalPages);
        }
        handlePagesCount();
    }, [filteredProducts]);

    useEffect(() => {
        const currentPageData = filteredProducts.slice(0, 5);
        setCurrentProducts(currentPageData);
    }, [filteredProducts])


    const handlePageChange = (event, value) => {
        const currentPageData = productsData.slice((value - 1) * 5, value * 5);
        setCurrentProducts(currentPageData);
    }

    // all related to filter click:
    const handleFilterClick = (e) => {
        // Handle filter click logic here
        setFilterOption(e.target.textContent);
        setSelectedFilter(null);
        setOpenFilter(false); // Close the dropdown after selection
    }

    //handleSearch 
    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    }

    const handleSelectedFilter = (e) => {
        setSelectedFilter(e.target.textContent);
    }

    useEffect(() => {
        const handleproducts = () => {
            let filteredProducts = [];

            //filter products based on search
            const searchedProducts = productsData.filter((product) => {
                return product.productName.toLowerCase().includes(searchQuery.toLowerCase());
            })

            filteredProducts = searchedProducts;

            //filter products based on selectedFilter:
            if (filterOption != 'All' && selectedFilter != null) {
                if (filterOption == 'Category') {
                    filteredProducts = searchedProducts.filter((product) => {
                        return product.category.includes(selectedFilter);
                    })
                }
                else if (filterOption == 'Price') {
                    const price = selectedFilter.split('-');
                    filteredProducts = searchedProducts.filter((product) => {
                        return product.price >= price[0] && product.price <= price[1];
                    })
                }
            }
            setFilteredProducts(filteredProducts);
        }

        handleproducts();
    }, [selectedFilter, searchQuery, productsData]);




    return (
        <div className='w-full px-8 max-md:px-4 py-6 md:max-h-[91vh] overflow-y-auto remove-scroll min-h-[88vh]'>
            <div className='animate'>
                <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>Inventory</h1>
                <p className='text-gray-600 dark:text-gray-400 text-sm'>View your complete inventory and manage your products.</p>
            </div>

            {/* search bar and add new product button */}
            <div className='w-full flex justify-start items-center py-2 mt-4 gap-2 flex-wrap relative animate'>
                <div className='w-full flex justify-start items-center gap-4 flex-wrap'>
                    <div className='w-full grid grid-cols-[4fr,1fr,1fr] max-xl:grid-cols-1 gap-4 flex-wrap'>
                        <div className='w-full flex items-center gap-2 mr-2 border rounded-md px-3'>
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full py-2 rounded-lg focus:outline-none dark:bg-black dark:text-white max-w-[1050px] min-w-[250px] text-gray-800 placeholder:text-gray-500"
                                onChange={handleSearchInputChange}
                                value={searchQuery}
                            />
                            <GoSearch className='text-2xl text-gray-500' />
                        </div>
                        <div className='relative border-gray-400  min-w-[153px] max-md:w-full filter'>
                            <div className='flex items-center border gap-2 justify-between hover:border-gray-300 hover:cursor-pointer px-4 py-2 rounded-lg' onClick={() => setOpenFilter(!openFilter)}>
                                <div>
                                    <button>Filter</button>
                                </div>
                                <div className='flex items-center  gap-2'>
                                    <p className='text-sm text-gray-500'>{filterOption}</p>
                                    <BiFilter size={20} />
                                </div>
                            </div>

                            <div className={`flex flex-col text-md text-gray-500 absolute top-[24px] left-0 z-50 border-b-[1px] border-r-[1px] border-l-[1px] bg-white dark:bg-gray-800 rounded-b-lg p-2 mt-2 w-full ${openFilter ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none top-4'} transition-all duration-300 ease-in-out`}>
                                <div className='hover:cursor-pointer hover:bg-black hover:text-white p-1 rounded-lg px-2' onClick={handleFilterClick}>All</div>
                                <div className='hover:cursor-pointer hover:bg-black hover:text-white p-1 rounded-lg px-2' onClick={handleFilterClick}>Category</div>
                                <div className='hover:cursor-pointer hover:bg-black hover:text-white p-1 rounded-lg px-2' onClick={handleFilterClick}>Price</div>
                            </div>

                        </div>
                        <button className='px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 min-w-[150px] max-md:w-full' onClick={() => setShowAddProduct(!showAddProduct)}>Add Product</button>
                    </div>
                </div>
                {/* filter options  */}
                <div className={`w-full border p-2  rounded-lg flex justify-start items-center gap-3 bg-white ${filterOption == 'All' ? 'opacity-0 pointer-events-none -top-2' : 'opacity-100 pointer-events-auto top-0'} transition-all duration-300 ease-in-out z-30`}>
                    {
                        filterOption != 'All' && options[filterOption].map((ele, index) => (
                            <div className='p-1 px-2 rounded-lg bg-gray-100 text-gray-600  hover:text-black text-sm hover:cursor-pointer' onClick={handleSelectedFilter}>{ele}</div>
                        ))
                    }
                </div>
                {/* Products List */}
                < div className='w-full border dark:border-gray-600 p-2 rounded-lg grid grid-cols-[2fr,1fr,1fr,1fr,1fr] gap-4 mt-2 bg-gray-50 dark:bg-gray-900 mb-2 animate z-10'>
                    <div><h3 className='text-md font-semibold text-gray-700 dark:text-white'>Product</h3></div>
                    <div><h3 className='text-md font-semibold text-gray-700 dark:text-white max-md:hidden'>Selling Price</h3></div>
                    <div><h3 className='text-md font-semibold text-gray-700 dark:text-white'>Items</h3></div>
                    <div><h3 className='text-md font-semibold text-gray-700 dark:text-white max-md:hidden'>Last Purchased </h3></div>
                    <div><h3 className='text-md font-semibold text-gray-700 dark:text-white flex justify-center'>Action</h3></div>
                </div>

            </div>


            <div className='w-full flex flex-col gap-2 md:max-h-[48vh] animate' >

                {
                    loading ? (
                        <div className='w-full flex justify-center items-center z-10 bg-gray-50 p-4 rounded-lg text-gray-800'>Fetching Products...</div>
                    ) :
                        currentProducts.length <= 0 ? (<div className='w-full flex justify-center items-center z-10 bg-red-50 p-4 rounded-lg text-gray-800'>No Products Found</div>) : currentProducts.map((product, index) => (
                            <ProductsComp key={index} product={product} isOpen={isOpen} setIsOpen={setIsOpen} setEditProductDetails={setEditProductDetails} getAllProducts={getAllProducts} setDeleteProduct={setDeleteProduct} setOpenDeleteModal={setOpenDeleteModal} onConfirmDelete={onConfirmDelete} setOnConfirmDelete={setOnConfirmDelete} />
                        ))
                }

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


            {/* AddProduct  */}
            <AddProduct showAddProduct={showAddProduct} setShowAddProduct={setShowAddProduct} getAllProducts={getAllProducts} productsData={productsData} />

            <EditProduct isOpen={isOpen} setIsOpen={setIsOpen} editProductDetails={editProductDetails} getAllProducts={getAllProducts} productsData={productsData} />

            <DeleteConfirmationModal openDeleteModal={openDeleteModal} setOpenDeleteModal={setOpenDeleteModal} setOnConfirmDelete={setOnConfirmDelete} itemName={deleteProduct.productName} />


        </div>
    )
}

export default Inventory
