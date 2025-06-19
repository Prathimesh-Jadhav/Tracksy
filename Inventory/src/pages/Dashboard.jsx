import React, { useEffect, useState } from 'react'
import SummaryCard from '../components/SummaryCard'
import { summaryCards } from '../data/LandComments'
import { LineChart } from '@mui/x-charts/LineChart';
import { products } from '../data/LandComments'; // Assuming you have a products data file
import DashProdCompleteList from '../components/DashProdCompleteList';
import RecentBuyings from '../components/RecentBuyings';
import { GlobalContext } from '../context/AppContext';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

const Dashboard = () => {
  const [periodOption, setPeriodOption] = React.useState('T');
  const { setSelectedOption,darkMode } = React.useContext(GlobalContext);
  const [productsData, setProductsData] = React.useState([]);
  const [salesData, setSalesData] = React.useState([]);
  const [totalInventory, setTotalInventory] = React.useState(0);
  const [totalSales, setTotalSales] = React.useState(0);
  const [summCards, setSummCards] = useState(summaryCards)
  const [last7DaysSales, setLast7DaysSales] = useState([]);
  const [last7DaysRevenue, setLast7DaysRevenue] = useState([]);
  const [last7Days, setLast7Days] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);


  useEffect(() => {
    setSelectedOption('dashboard');
  }, []);

  useGSAP(() => {
    gsap.from('.animate', { y: 50, opacity: 0, duration: 0.7, ease: 'power2.out', stagger: 0.2 });
  }, []);

  const margin = { right: 24 };
  const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
  const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
  const xLabels = [
    'Page A',
    'Page B',
    'Page C',
    'Page D',
    'Page E',
    'Page F',
    'Page G',
  ];

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
    components: {
      MuiChartsAxis: {
        styleOverrides: {
          line: {
            stroke: 'white',
          },
          tickLabel: {
            fill: 'white',
          },
          label: {
            fill: 'white',
          },
        },
      },
    },
  });

  const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
  components: {
    MuiChartsAxis: {
      styleOverrides: {
        line: {
          stroke: 'black', // Axis line
        },
        tickLabel: {
          fill: 'black', // Tick numbers
        },
        label: {
          fill: 'black', // Axis label
        },
      },
    },
  },
});


  useEffect(() => {
    getAllProducts();
    getAllSales();

  }, []);

  useEffect(() => {
    calculateTotalInventory();
    getSalesAndRevenueLast7Days();
  }, [productsData, salesData]);

  useEffect(() => {
    calculateSalesAndRevenue();
  }, [salesData, periodOption]);


  useEffect(() => {
    const lowStockProducts = productsData.filter(product => product.items < 5);
    setLowStockProducts(lowStockProducts);
  }, [productsData]);


  //retrived all products from database
  const getAllProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/productRoutes/getProducts`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      setProductsData(response.data);
    }
    catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      }
      else {
        toast.error("Something went wrong");
      }
    }
  }

  //retrived all sales from database
  const getAllSales = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/salesRoutes/getSales`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      console.log("sales", response.data);
      setSalesData(response.data);
    }
    catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      }
      else {
        console.error('Error fetching sales data:', error);
        toast.error('Failed to fetch sales data');
      }
    }
  }

  const calculateSalesAndRevenue = () => {
    try {

      let totalSalesAmount = 0;
      let totalRevenue = 0;
      let totalCost = 0;
      let sales = salesData;

      const thisMonthSales = salesData.filter(sale => {
        const saleDate = new Date(sale.updatedAt.split('T')[0]);
        const currentDate = new Date();
        return saleDate.getMonth() === currentDate.getMonth() && saleDate.getFullYear() === currentDate.getFullYear();
      });

      const thisWeekSales = salesData.filter(sale => {
        const saleDate = new Date(sale.updatedAt.split('T')[0]);
        const currentDate = new Date();
        const oneWeekAgo = new Date(currentDate);
        oneWeekAgo.setDate(currentDate.getDate() - 7);
        return saleDate >= oneWeekAgo && saleDate <= currentDate;
      });

      const todaySales = salesData.filter(sale => {
        const saleDate = new Date(sale.updatedAt.split('T')[0]);
        const currentDate = new Date();
        return saleDate.toDateString() === currentDate.toDateString();
      });

      if (periodOption === 'T') {
        sales = todaySales;
      } else if (periodOption === 'W') {
        sales = thisWeekSales;
      } else if (periodOption === 'M') {
        sales = thisMonthSales;
      }

      for (const sale of sales) {
        totalSalesAmount += Number(sale.amountPaid);
        for (const soldProduct of sale.soldProducts) {
          const { quantity, costPrice } = soldProduct;

          if (quantity && costPrice) {
            totalCost += Number(costPrice) * Number(quantity);
          }
          else {
            toast.error('Error in calculating revenue')
            return;
          }

        }
      }

      totalRevenue = totalSalesAmount - totalCost;

      const updatedCards = summaryCards.map((card) => {
        if (card.id === 2) {
          return { ...card, value: totalSalesAmount };
        } else if (card.id === 3) {
          return { ...card, value: totalRevenue };
        } else if (card.id === 1) {
          return { ...card }; // inventory, already set elsewhere
        }
        return card;
      });

      setSummCards(updatedCards);
    } catch (error) {
      console.error('Error calculating sales and revenue:', error);
    }
  };

  //calculate total inventory:
  const calculateTotalInventory = () => {
    const totalInventory = productsData.reduce((total, product) => total + product.items, 0);
    summaryCards[0].value = totalInventory;
  }

  const getLast7Days = () => {
    const result = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      result.push(date.toISOString().split('T')[0]); // Format: YYYY-MM-DD
    }

    return result;
  };

  const getSalesAndRevenueLast7Days = () => {
    const last7Days = getLast7Days();
    const salesPerDay = [];
    const revenuePerDay = [];

    last7Days.forEach(dateStr => {
      let daySales = 0;
      let dayCost = 0;

      salesData.forEach(sale => {
        const saleDate = sale.updatedAt.split('T')[0];

        if (saleDate === dateStr) {
          daySales += Number(sale.amountPaid);
          sale.soldProducts.forEach(prod => {
            if (prod.costPrice && prod.quantity) {
              dayCost += Number(prod.costPrice) * Number(prod.quantity);
            }
          });
        }
      });
      salesPerDay.push(daySales);
      revenuePerDay.push(daySales - dayCost);
    });

    setLast7DaysRevenue(revenuePerDay);
    setLast7DaysSales(salesPerDay);
    setLast7Days(last7Days);

    // return { salesPerDay, revenuePerDay, last7Days };
  };



  return (
    <div className='w-full px-8 max-md:px-4 py-6 max-h-[91vh] overflow-y-auto remove-scroll'>
      <div className='animate'>
        <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>Dashboard</h1>
        <p className='text-gray-600 dark:text-gray-400 text-sm'>Welcome to your dashboard! Here you can find an overview of your data.</p>
      </div>

      {/* summary Cards  */}
      <div className='w-full flex justify-start items-center py-3 mt-4 gap-6 flex-wrap'>
        {
          summCards.map((card) => (
            <SummaryCard key={card.id} title={card.title} value={card.value} Icon={card.icon} subscript={card.subscript} color={card.color} periodOption={periodOption} setPeriodOption={setPeriodOption} />
          ))
        }
      </div>

      {/* Sales and Demanded Product  */}
      <div className='w-full flex justify-start items-start gap-6 flex-wrap mt-6 '>

        <div className='md:min-w-[700px] max-md:w-full border-2 dark:border-gray-600 rounded-xl p-4 animate'>
          <h2 className='text-lg font-semibold text-gray-800 dark:text-white'>Sales & Revenue Overview</h2>
          <p className='text-gray-600 dark:text-gray-400 text-sm'>Track your sales performance over time.</p>
          {/* Placeholder for Sales Chart */}
          <div className='w-full h-84 bg-gray-50 dark:bg-gray-900 rounded-lg mt-4'>
            <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
              <LineChart
                height={300}
                series={[
                  { data: last7DaysSales, label: 'Sales' },
                  { data: last7DaysRevenue, label: 'Revenue' },
                ]}
                xAxis={[{ scaleType: 'point', data: last7Days }]}
                yAxis={[{ width: 50 }]}
                margin={margin}
              />
            </ThemeProvider>

          </div>
        </div>


        <div className='xl:min-w-[450px] border-2 dark:border-gray-600 rounded-xl p-4 max-xl:w-full animate'>
          <h2 className='text-lg font-semibold text-gray-800'>Products Going To Complete</h2>
          <p className='text-gray-600 dark:text-gray-400 text-sm'>Monitor the products that are nearing completion.</p>
          {/* Placeholder for Products Chart */}
          <div className='w-full h-84 bg-gray-50 dark:bg-gray-900 rounded-lg mt-4'>
            {/* Placeholder for Product Chart */}
            <div className='text-center text-gray-500 dark:text-gray-300'>
              <DashProdCompleteList lowStockProducts={lowStockProducts} />
            </div>
          </div>
        </div>

        {/* Recent sales  */}
        <div className='w-full mt-3 animate'>
          <RecentBuyings salesData={salesData} />
        </div>
      </div>



    </div>
  )
}

export default Dashboard
