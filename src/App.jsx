import { BrowserRouter, Routes, Route } from "react-router-dom"
import Loginpage from "./pages/loginpage"
import DashboardPage from "./pages/dashboard"
import UserPage from "./pages/users"
import Productspage from "./pages/product"
import Orderpage from "./pages/order"
import Adspage from "./pages/ads"
import Adminpage from "./pages/admin"
import Refundpage from "./pages/refund"
import Addproductpage from "./pages/addproductpage"

function App() {
  

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Loginpage/>}/>
      <Route path="/dashboard" element={<DashboardPage/>}/>
      <Route path="/users" element={<UserPage/>}/>
      <Route path="/product" element={<Productspage/>}/>
      <Route path="/order" element={<Orderpage/>}/>
      <Route path="/ads" element={<Adspage/>}/>
      <Route path="/admin" element={<Adminpage/>}/>
      <Route path="/refund" element={<Refundpage/>}/>
      <Route path="/addproduct" element={<Addproductpage/>}/>
    </Routes>
    
    
    </BrowserRouter>
    </>
  )
}

export default App
