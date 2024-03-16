import axios from "axios";
import { AxiosInstance } from "axios";

const instance : AxiosInstance = axios.create({
  baseURL: `http://localhost:5500`,
});


export default instance;
