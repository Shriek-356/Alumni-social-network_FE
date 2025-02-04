
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
    'getUserPosts': (id) => `/accounts/${id}/post/`,
    'searchUsers':(value) => `/users/search_account/?full_name=${value}`,
    'getAlumni' : "/alumni_accounts/",
    'approvalAlumni' :(id) => `/alumni_accounts/${id}/`,
    'registerLecturer' : "/users/create_lecturer/",
    'updateAccount' :(id) => `/accounts/${id}/`,
    'updateUser' : (id) => `/users/${id}/`,
    'changePassword' : "/users/change-password/"
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

export const getUserPostss = async(token,id) => {
    try{
        let response = await axiosDAuthApiInstance(token).get(endpoints.getUserPosts(id))
        return response.data
    }catch(ex){
        console.log(ex)
        throw(ex)
    }
}

export const searchUserss = async(token,value) =>{
    try{
        let response = await axiosDAuthApiInstance(token).get(endpoints.searchUsers(value))
        return response.data
    }catch(ex){
        console.log(ex)
        throw(ex)
    }
}

export const getAlumnis = async(token) =>{
    try{
        let response = await axiosDAuthApiInstance(token).get(endpoints.getAlumni)
        return response.data
    }catch(ex){
        console.log(ex)
        throw(ex)
    }
}

export const approvalAlumnis = async(token,id,data)=>{
    try{
        let response = await axiosDAuthApiInstance(token).patch(endpoints.approvalAlumni(id),data, {
            headers: {
                'Content-Type': 'application/json' 
            }
        })
        return response.data
    }catch(ex){
        console.log(ex)
        throw(ex)
    }
}

export const registerLecturerr = async(token,data)=>{
    try{
        let response = await axiosDAuthApiInstance(token).post(endpoints.registerLecturer,data, {
            headers: {
                'Content-Type': 'application/json' 
            }
        })
        return response.data
    }catch(ex){
        console.log(ex)
        throw(ex)
    }
}

export const updateAccountt = async(token,id,data)=>{
    try{
        let response = await axiosDAuthApiInstance(token).patch(endpoints.updateAccount(id),data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    }catch(ex){
        console.log(ex)
        throw(ex)
    }
}

export const updateUserr= async(token,id,data)=>{
    try{
        let response = await axiosDAuthApiInstance(token).patch(endpoints.updateUser(id),data, {
            headers: {
                'Content-Type': 'application/json' 
            }
        })
        return response.data
    }catch(ex){
        console.log(ex)
        throw(ex)
    }
}

export const changePasswordd= async(token,data)=>{
    try{
        let response = await axiosDAuthApiInstance(token).post(endpoints.changePassword,data)
        return response.data
    }catch(ex){
        console.log(ex)
        throw(ex)
    }
}




