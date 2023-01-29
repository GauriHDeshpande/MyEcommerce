import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Enquiries from './pages/Enquiries';
import Bloglist from './pages/BlogList';
import Blogcatlist from './pages/BlogCatList';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Colorlist from './pages/ColorList';
import Categorylist from './pages/CategoryList';
import Brandlist from './pages/BrandList';
import Productlist from './pages/ProductList';
import Addblog from './pages/AddBlog';
import Addblogcat from './pages/AddBlogCat';
import Addcolor from "./pages/AddColor";
import Addcat from "./pages/AddCat";
import Addbrand from "./pages/AddBrand";
import Addproduct from "./pages/AddProduct";
import Couponlist from "./pages/CouponList";
import AddCoupon from "./pages/AddCoupon";
// import ViewEnq from "./pages/ViewEnq";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/reset-password' element={<ResetPassword/>} />
        <Route path='/forgot-password' element={<ForgotPassword/>} />
        <Route path='/admin' element={<MainLayout/>}>
          <Route index element={<Dashboard/>} />
          <Route path="enquiries" element={<Enquiries />} />
          {/* <Route path="enquiries/:id" element={<ViewEnq />} /> */}
          <Route path="blog-list" element={<Bloglist />} />
          <Route path="blog" element={<Addblog />} />
          <Route path="blog/:id" element={<Addblog />} />
          <Route path="coupon-list" element={<Couponlist />} />
          <Route path="coupon" element={<AddCoupon />} />
          <Route path="coupon/:id" element={<AddCoupon />} />
          <Route path="blog-category-list" element={<Blogcatlist />} />
          <Route path="blog-category" element={<Addblogcat />} />
          <Route path="blog-category/:id" element={<Addblogcat />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="color-list" element={<Colorlist />} />
          <Route path="color" element={<Addcolor />} />
          <Route path="color/:id" element={<Addcolor />} />
          <Route path="category-list" element={<Categorylist />} />
          <Route path="category" element={<Addcat />} />
          <Route path="category/:id" element={<Addcat />} />
          <Route path="brand-list" element={<Brandlist />} />
          <Route path="brand" element={<Addbrand />} />
          <Route path="brand/:id" element={<Addbrand />} />
          <Route path="product-list" element={<Productlist />} />
          <Route path="product" element={<Addproduct />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
