import axios from "axios";

import { apiUrl } from "./constants";

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "production" ? apiUrl : "http://localhost:3000/",
});

export default api;
