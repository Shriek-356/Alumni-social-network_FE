import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
const baseURL = 'https://socialapp130124.pythonanywhere.com/'

//có gán baseURL ở hàm dưới rồi -> có viết api của chat trong này luôn
const endpoints = {

      
    'getCurrentUser':'/users/current_user/',
    'getAccountUser': (id) => `/users/${id}/account/`,
    
   
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

const axiosInstance = axios.create({
    baseURL:baseURL,
    timeout:5000
})

export const axiosDAuthApiInstance = (token) =>{
    return axios.create({
        baseURL:baseURL,
        timeout:5000,
        headers:{
            "Authorization": "Bearer " + token
        }
    })
}

export default axiosInstance


// Hàm lưu token 
export const saveeToken = async (token) => {
    try {
        await AsyncStorage.setItem('@access_token', token); 
        console.log('Token đã được lưu');
    } catch (error) {
        console.error('Lỗi khi lưu token: ', error);
    }
};


// Hàm lấy token
export const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('@access_token');
        return token; // Trả về token
    } catch (error) {
        console.error('Lỗi khi lấy token: ', error);
    }
};


// Hàm xóa token
export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem('@access_token');
        console.log('Token đã bị xóa');
    } catch (error) {
        console.error('Lỗi khi xóa token: ', error);
    }
};