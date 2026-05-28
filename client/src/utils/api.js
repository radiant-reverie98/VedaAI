import axios from "axios";
console.log(import.meta.env.VITE_URL);
const api = axios.create({
  
  baseURL: import.meta.env.VITE_URL,
  withCredentials: true,
});

export default api;
