
import axiosInstance from "../api";

const endpoints = {
    'users':"/users"
}

export const fetchUsers = async () =>{
    try{
        let response = await axiosInstance.get(endpoints.users);
        return response.data;
    }
    catch(ex){
        console.log(ex)
        throw(ex)
    }
}