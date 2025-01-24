import { axiosDAuthApiInstance } from "../api";

const endpoints = {
    'getAllPosts':"/post/",
    'getPostComments': (id) => `/post/${id}/comments/`
}

export const getAllPostss = async(token) => {
    try{
        let response = await axiosDAuthApiInstance(token).get(endpoints.getAllPosts)
        return response.data
    }catch(ex){
        console.log(ex)
        throw(ex)
    }
}


export const getPostCommentss = async(token,id) => {
    try{
        let response = await axiosDAuthApiInstance(token).get(endpoints.getPostComments(id))
        return response.data
    }
    catch(ex){
        console.log(ex)
        throw(ex)
    }
}
