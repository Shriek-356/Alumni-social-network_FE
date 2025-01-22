
import axiosInstance from "../api";
import { axiosDAuthApiInstance } from "../api";
import qs from 'qs'

const endpoints = {
    'users':"/users",
    'registerAlumni':"/users/create_alumni/",
    'login':"/oauth2/token/",
    'getCurrentUser':'/users/current_user/',
    'getAccountUser': (id) => `/users/${id}/account/`,
    'getAlumniAccount': (id) => `/alumni_accounts/${id}/`,
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


export const registerAlumni = async (userData)=>{
    try{
        let response = await axiosInstance.post(endpoints.registerAlumni,userData, {
            headers: {
                'Content-Type': 'application/json' 
            }
        });
        return response.data
    }catch(ex){
        console.log(ex)
        throw(ex)
    }
}

export const login = async (loginData) =>{
    try{
        const data = qs.stringify({
            username: loginData.username,
            password: loginData.password,
            client_id: loginData.client_id,
            client_secret: loginData.client_secret,
            grant_type: loginData.grant_type
        });

        let response  = await axiosInstance.post(endpoints.login,data,{
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return response.data;
    }
    catch(ex){
        console.log(ex)
        throw(ex)
    }
}


export const getCurrentUser = async(token) => {
    try{
        let response = await axiosDAuthApiInstance(token).get(endpoints.getCurrentUser)
        return response.data
    }
    catch(ex){
        console.log(ex)
        throw(ex)
    }
}

export const getAccountUser = async(token,id) => {
    try{
        let response = await axiosDAuthApiInstance(token).get(endpoints.getAccountUser(id))
        return response.data
    }
    catch(ex){
        console.log(ex)
        throw(ex)
    }
}

export const getAlumniAccountt = async (token,id) => {
    try{
        let response = await axiosDAuthApiInstance(token).get(endpoints.getAlumniAccount(id))
        return response.data
    }catch(ex){
        console.log(ex)
        throw(ex)
    }
}