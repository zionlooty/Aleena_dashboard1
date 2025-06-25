import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Loginpage from "./pages/loginpage"
import DashboardPage from "./pages/dashboard"
import UserPage from "./pages/users"
import Productspage from "./pages/product"
import Orderpage from "./pages/order"
import Adspage from "./pages/ads"
import Adminpage from "./pages/admin"
import Refundpage from "./pages/refund"
import Addproductpage from "./pages/addproductpage"
import ViewPage from "./pages/view"
import PromoPage from "./pages/promo"
import ErrorBoundary from "./components/ErrorBoundary"

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken")
  return token ? children : <Navigate to="/login" replace />
}

// Login Auth Component (redirect to dashboard if already logged in)
const LoginAuth = ({ children }) => {
  const token = localStorage.getItem("adminToken")
  return !token ? children : <Navigate to="/" replace />
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
      <Route path="/login" element={
        <LoginAuth>
          <Loginpage/>
        </LoginAuth>
      }/>
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardPage/>
        </ProtectedRoute>
      }/>
      <Route path="/users" element={
        <ProtectedRoute>
          <UserPage/>
        </ProtectedRoute>
      }/>
      <Route path="/product" element={
        <ProtectedRoute>
          <Productspage/>
        </ProtectedRoute>
      }/>
      <Route path="/order" element={
        <ProtectedRoute>
          <Orderpage/>
        </ProtectedRoute>
      }/>
      <Route path="/ads" element={
        <ProtectedRoute>
          <Adspage/>
        </ProtectedRoute>
      }/>
      <Route path="/admin" element={
        <ProtectedRoute>
          <Adminpage/>
        </ProtectedRoute>
      }/>
      <Route path="/refund" element={
        <ProtectedRoute>
          <Refundpage/>
        </ProtectedRoute>
      }/>
      <Route path="/promo" element={
        <ProtectedRoute>
          <PromoPage/>
        </ProtectedRoute>
      }/>
      <Route path="/addproduct" element={
        <ProtectedRoute>
          <Addproductpage/>
        </ProtectedRoute>
      }/>
      <Route path="/view/product/:prodID" element={
        <ProtectedRoute>
          <ViewPage/>
        </ProtectedRoute>
      }/>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
