import { base_url } from '../../utils/baseURL';
import axios from 'axios';

const getUsers = async () => {
  const response = await axios.get(`${base_url}user/allUsers`);
  return response.data;
};

const customerService = {
  getUsers,
};


export default customerService;