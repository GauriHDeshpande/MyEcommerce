import { base_url } from '../../utils/baseURL';
import axios from 'axios';

const getAllProducts = async () => {
  const response = await axios.get(`${base_url}product/get-all-products`);
  return response.data;
};

const productService = {
  getAllProducts,
};


export default productService;