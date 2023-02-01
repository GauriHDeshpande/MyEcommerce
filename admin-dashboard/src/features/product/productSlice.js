import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "./productService";

export const getAllProducts = createAsyncThunk('product/get-products', async (thunkAPI) => {
  try {
    return await productService.getAllProducts()
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
});

const initialState = {
  products: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
}

export const productSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(getAllProducts.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getAllProducts.fulfilled, (state, action) => {
      state.isError = false;
      state.isLoading = false;
      state.isSuccess = true;
      state.products = action.payload;
      state.message = "success"; 
    })
    .addCase(getAllProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.message = action.error;
    });
  }
});

export default productSlice.reducer;