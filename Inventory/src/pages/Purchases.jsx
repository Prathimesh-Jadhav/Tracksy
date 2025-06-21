import React, { useState, useMemo } from 'react';
import { Trash2, Download, Edit2, Check, X } from 'lucide-react';
import axios from 'axios';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { GlobalContext } from '../context/AppContext';
import { Quantum } from 'ldrs/react'
import 'ldrs/react/Quantum.css'
import ForecastPeriodSelector from '../components/ForecastPeriodSelector';



const PurchaseListPage = () => {
  const { setSelectedOption } = React.useContext(GlobalContext);

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [formattedProducts, setFormattedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('next-week');

  useEffect(() => {
    setSelectedOption('purchases');

    setTimeout(async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/salesForecast/${selectedPeriod}`,
          { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }
        );
        setProducts(response.data.results || []);
        if (response.data.message) {
          toast.success(response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          console.error('Error fetching products:', error.response.data.message);
          toast.error(error.response.data.message);
        }
        console.error('Error fetching products:', error);
      }
    }, 100);
  }, [selectedPeriod]);

  useEffect(() => {
    if (!products || products.length === 0) return;

    const getAllProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/productRoutes/getProducts`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        });
        setAllProducts(response.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to fetch products');
      }
    };
    getAllProducts();
  }, [products]);

  useEffect(() => {
    if (!allProducts || allProducts.length === 0) return;

    const finalProducts = () => {
      const filteredProducts = products.map((product) => {
        const allProduct = allProducts.find(p => p.productId === product.productId);
        if (allProduct) {
          return {
            ...product,
            name: allProduct.name,
            costPrice: allProduct.costPrice,
            recommendedQty: product.recommendedQty || 0,
            totalAmount: Number(product.recommendedQty * allProduct.costPrice)
          };
        }
        return null;
      }).filter(Boolean); // Remove null entries

      console.log('Final Products:', filteredProducts);
      setFormattedProducts(filteredProducts);
      setLoading(false);
    };
    finalProducts();
  }, [allProducts, products]); // Add products as dependency

  // Pagination logic - use formattedProducts instead of products
  const totalPages = Math.ceil(formattedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = formattedProducts.slice(startIndex, endIndex);

  // Calculate total price for each product
  const productsWithTotals = useMemo(() => {
    return currentProducts.map(product => ({
      ...product,
      totalPrice: product.costPrice * product.recommendedQty
    }));
  }, [currentProducts]);

  // Handle quantity edit - Fixed to use productId and update both states
  const startEdit = (productId, currentQty) => {
    setEditingId(productId);
    setEditValue(currentQty.toString());
  };

  const saveEdit = (productId) => {
    const newQty = parseInt(editValue);
    if (!isNaN(newQty) && newQty >= 0) {
      // Update products state
      setProducts(prev => prev.map(product =>
        product.productId === productId ? { ...product, recommendedQty: newQty } : product
      ));

      // Update formattedProducts state immediately
      setFormattedProducts(prev => prev.map(product =>
        product.productId === productId
          ? {
            ...product,
            recommendedQty: newQty,
            totalAmount: Number(newQty * product.costPrice)
          }
          : product
      ));
    }
    setEditingId(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  // Handle delete - Fixed to use productId
  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(product => product.productId !== productId));
    setFormattedProducts(prev => prev.filter(product => product.productId !== productId));

    // Adjust current page if needed
    const newTotalPages = Math.ceil((formattedProducts.length - 1) / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  // Download functionality - Fixed to use current data
  const downloadCSV = () => {
    const csvContent = [
      ['Product ID', 'Product Name', 'Cost Price', 'Recommended Quantity', 'Total Price'],
      ...formattedProducts.map(product => [
        product.productId,
        product.name || product.productName, // Handle both possible field names
        product.costPrice,
        product.recommendedQty,
        (product.costPrice * product.recommendedQty).toFixed(2)
      ])
    ];

    const csvString = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `purchase-list-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Pagination component - Fixed to use formattedProducts length
  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between mt-6 dark:bg-black max-md:justify-center">
        <div className="text-sm text-gray-600 dark:text-white max-md:hidden">
          Showing {startIndex + 1} to {Math.min(endIndex, formattedProducts.length)} of {formattedProducts.length} products
        </div>
        <div className="flex items-center space-x-2 ">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {startPage > 1 && (
            <>
              <button
                onClick={() => setCurrentPage(1)}
                className="px-3 py-2 text-sm border rounded-md hover:bg-gray-50"
              >
                1
              </button>
              {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
            </>
          )}

          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-3 py-2 text-sm border rounded-md ${currentPage === number
                ? 'bg-blue-500 text-white border-blue-500'
                : 'hover:bg-gray-50'
                }`}
            >
              {number}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="px-3 py-2 text-sm border rounded-md hover:bg-gray-50"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full mx-auto md:p-6 max-md:p-4 bg-white md:max-h-[91vh] overflow-y-auto remove-scroll dark:bg-black dark:text-white">
      {/* Header */}
      <div className="md:flex max-md:grid grid-cols-1 justify-between items-center mb-6 gap-4">
        <div className="flex flex-col dark:text-white max-md:w-full">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Purchase List</h1>
          <p className="text-gray-600 text-sm dark:text-white break-all">AI-Recommended Products to Restock</p>
        </div>
        <div className='grid md:grid-cols-2 max-md:grid-cols-1 items-center gap-4'>
          <ForecastPeriodSelector onChange={(value) => setSelectedPeriod(value)} />

          <button
            onClick={downloadCSV}
            className="flex items-center max-md:justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={20} />
            <span> Download CSV</span>

          </button>
        </div>

      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto min-h-[400px] max-sm:max-w-[280px] dark:bg-gray-800 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-sm ">Product ID</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Product Name</th>
                <th className="text-right py-3 px-4 font-medium text-sm ">Cost Price</th>
                <th className="text-center py-3 px-4 font-medium text-sm">Recommended Quantity</th>
                <th className="text-right py-3 px-4 font-medium text-sm">Total Price</th>
                <th className="text-center py-3 px-4 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-500">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-[6rem]">
                    <Quantum
                      size="45"
                      speed="4.75"
                      color="violet"
                    />
                    {/* <div className="text-gray-500 relative">
                      AI is making your purchase list
                      <span className="inline-block w-4 overflow-hidden align-bottom animate-aiThinking">...</span>
                    </div> */}
                    <div className="relative">
                      <span className="gradient-slide font-medium text-lg">
                        AI is making your purchase list
                      </span>
                      <span className="inline-flex ml-2 items-center gap-0.5">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full loading-dot"></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full loading-dot"></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full loading-dot"></span>
                      </span>
                    </div>
                  </td>
                </tr>
              ) : formattedProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    <div className="text-gray-500">No products found</div>
                  </td>
                </tr>
              ) : (
                currentProducts.map((product) => (
                  <tr key={product.productId} className="hover:bg-gray-50 dark:hover:bg-gray-500 dark:text-white">
                    <td className="py-3 px-4 text-sm font-medium">
                      {product?.productId}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {product?.name || product?.productName}
                    </td>
                    <td className="py-3 px-4 text-sm text-right">
                      ₹{product?.costPrice}
                    </td>
                    <td className="py-3 px-4 text-sm text-center">
                      {editingId === product.productId ? (
                        <div className="flex items-center justify-center space-x-2">
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            min="0"
                            autoFocus
                          />
                          <button
                            onClick={() => saveEdit(product.productId)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <span>{product.recommendedQty}</span>
                          <button
                            onClick={() => startEdit(product.productId, product.recommendedQty)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-medium">
                      ₹{product.totalAmount || (product.costPrice * product.recommendedQty).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => deleteProduct(product.productId)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500 p-4 rounded-md text-sm mt-4">
        <strong>Note:</strong> Products with less than 2 days of sales data will show a recommended quantity of 0 due to forecast limitations.
      </div>

      {/* Summary */}
      <div className="mt-6 bg-gray-50 dark:bg-black dark:text-white dark:border dark:border-gray-600 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">
            Total Products: {formattedProducts.length}
          </span>
          <span className="text-lg font-semibold">
            ₹{formattedProducts.reduce((sum, product) => sum + (Number(product.costPrice) * Number(product.recommendedQty)), 0).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Pagination */}
      <Pagination />
    </div>
  );
};

export default PurchaseListPage;