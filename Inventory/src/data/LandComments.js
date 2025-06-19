import profile1 from "../assets/profile1.jpg";
import profile2 from "../assets/profile2.jpg";
import profile3 from "../assets/profile3.jpg";
import profile4 from "../assets/profile4.jpg";
import home from "../assets/home.png";
import sellProduct from "../assets/trade.png";
import sales from "../assets/sales.png";
import purchase from "../assets/shopping-bag.png";
import inventory from "../assets/logistics (1).png";
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import { MdOutlineSell } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { GoHome } from "react-icons/go";
import { MdOutlineInventory2 } from "react-icons/md";
import { TbArrowsSort } from "react-icons/tb";
import { GiBuyCard } from "react-icons/gi";



export const landComments = [
  {
    id: 1,
    name: "John Doe",
    comment: "This is a great platform! I love how easy it is to track my tasks.",
    date: "2023-10-01",
    image: profile1,
    position: "left-0"
  },
  {
    id: 2,
    name: "Jane Smith",
    comment: "Tracksy has really helped me stay organized. Highly recommend!",
    date: "2023-10-02",
    image: profile2,
    position: "left-5"
  },
  {
    id: 3,
    name: "Alice Johnson",
    comment: "The user interface is so intuitive. I can’t imagine my life without it now.",
    date: "2023-10-03",
    image: profile3,
    position:"left-10"
  },
  {
    id: 3,
    name: "Alice Johnson",
    comment: "The user interface is so intuitive. I can’t imagine my life without it now.",
    date: "2023-10-03",
    image: profile4,
    position:"left-[60px]"
  }
]

export const navOptions = [
  {
    id: 1,
    name: "Dashboard",
    link: "dashboard",
    icon: GoHome
  },
  {
    id: 2,
    name: "Inventory",
    link: "inventory",
    icon: MdOutlineInventory2
  },
  {
    id: 3,
    name: "Sell Product",
    link: "sellProduct",
    icon: MdOutlineSell
  },
  {
    id: 4,
    name: "Sales",
    link: "sales",
    icon: TbArrowsSort
  },
  {
    id: 5,
    name: "Purchases",
    link: "purchases",
    icon: GiBuyCard
  }
]

export const summaryCards = [
  
  {
    id: 1,
    title: "Total Inventory",
    value: "500",
    subscript: "items",
    color:"violet",
    icon: MdOutlineLocalGroceryStore
  },
  {
    id: 2,
    title: "Total Sales",
    value: "2000",
    subscript: "Rs",
    color:"red",
    icon: MdOutlineSell
  },
  {
    id: 3,
    title: "Total Revenue",
    value: "300",
    subscript: "Rs",
    color:"green",
    icon: GiMoneyStack
  }]

  export const products = [
  {
    id: 1,
    name: 'Nike Air Max',
    image: 'https://via.placeholder.com/80',
    category: 'Shoes',
    price: 7999,
    stock: 5,
  },
  {
    id: 2,
    name: 'Apple Watch Series 8',
    image: 'https://via.placeholder.com/80',
    category: 'Wearables',
    price: 45999,
    stock: 12,
  },
  {
    id: 3,
    name: 'Wireless Mouse',
    image: 'https://via.placeholder.com/80',
    category: 'Accessories',
    price: 999,
    stock: 2,
  },
];

export const productsData = [
  {
    productName: "Wireless Mouse",
    category: "Electronics",
    items: 120,
    price: 25.99,
    lastPurchased: "2025-06-01"
  },
  {
    productName: "Notebook (A5)",
    category: "Stationery",
    items: 300,
    price: 2.50,
    lastPurchased: "2025-06-05"
  },
  {
    productName: "Ballpoint Pen (Pack of 10)",
    category: "Stationery",
    items: 500,
    price: 4.00,
    lastPurchased: "2025-06-03"
  },
  {
    productName: "LED Desk Lamp",
    category: "Home & Living",
    items: 60,
    price: 18.75,
    lastPurchased: "2025-05-30"
  },
  {
    productName: "USB-C Charging Cable",
    category: "Electronics",
    items: 200,
    price: 9.99,
    lastPurchased: "2025-06-06"
  },
  {
    productName: "Water Bottle (1L)",
    category: "Home & Living",
    items: 150,
    price: 6.25,
    lastPurchased: "2025-06-02"
  },
  {
    productName: "Laptop Stand",
    category: "Accessories",
    items: 70,
    price: 29.99,
    lastPurchased: "2025-05-27"
  }
];

export let salesData = [
  {
    "customerId": "CUST001",
    "customerName": "John Doe",
    "mobileNumber": "9876543210",
    "soldDate": "10-06-2025",
    "paidAmount": 1500
  },
  {
    "customerId": "CUST002",
    "customerName": "Jane Smith",
    "mobileNumber": "9123456780",
    "soldDate": "03-06-2025",
    "paidAmount": 2200
  },
  {
    "customerId": "CUST003",
    "customerName": "Amit Kumar",
    "mobileNumber": "9988776655",
    "soldDate": "05-06-2025",
    "paidAmount": 1800
  }
]

