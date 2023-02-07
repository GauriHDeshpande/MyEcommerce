import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import customerReducer from '../features/cutomers/customerSlice';
import productReducer from '../features/product/productSlice';
import brandReducer from '../features/brand/brandSlice';
import pcategoryReducer from '../features/pcategory/pcategorySlice'

export const store = configureStore({
  reducer: {
    auth: authReducer, 
    customers: customerReducer, 
    product: productReducer, 
    brand: brandReducer,
    pcategory: pcategoryReducer,
  },
});