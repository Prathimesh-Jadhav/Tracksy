import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AppContext from './context/AppContext'
import Layout from './Layout'
import Dashboard from './pages/Dashboard'
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import Inventory from './pages/Inventory'
import SellProducts from './pages/SellProducts'
import { ToastContainer } from 'react-toastify'
import Sales from './pages/Sales'
import Purchases from './pages/Purchases'
import SaleDetails from './pages/saleDetails'


function App() {
  const [count, setCount] = useState(0)


  return (
    <>
      <Router>
        <AppContext>
          <ToastContainer />
          <Theme >
            <Routes>
              <Route path='/' element={<LandingPage />} />
              <Route path='/layout' element={<Layout />} >
                <Route path='dashboard' element={<Dashboard />} />
                <Route path='inventory' element={<Inventory />} />
                <Route path='sellProduct' element={<SellProducts />} />
                <Route path='sales' element={<Sales />} />
                <Route path='purchases' element={<Purchases />} />
                <Route path='sales/saleDetails' element={<SaleDetails />} />
              </Route>
            </Routes>
          </Theme>
        </AppContext>
      </Router>

    </>
  )
}

export default App
