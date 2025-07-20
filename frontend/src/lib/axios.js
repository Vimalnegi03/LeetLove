import axios from 'axios'

export const axiosInstance=axios.create({
    baseURL:import.meta.env.MODE==='development'?"http://localhost:8080/api/v1":"https://leetlove.onrender.com",
    withCredentials:true,//to include cookies and headers

})
