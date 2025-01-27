import { axiosDAuthApiInstance } from "../api";

const endpoints = {
    'getAllPosts':"/post/",
    'getPostComments': (id) => `/post/${id}/comments/`,
    'addPostComments': "/comment/",
    'getTotalReactions': (id) => `/post/${id}/`,
    'getTotalReactionsAccount': (id) => `/post_reaction/${id}/reaction_by_account/`,
    'deleteReactions': (id) => `/post_reaction/${id}/`,
    'updateReactions': (id) => `/post_reaction/${id}/`,
    'addReactions': "/post_reaction/",
    'deletePost': (id) => `/post/${id}/`
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

export const addPostCommentss = async(token,dataComments)=>{
    try{
        let response = await axiosDAuthApiInstance(token).post(endpoints.addPostComments,dataComments)          
        return response.data
    }
    catch(ex){
        console.log(ex)
        throw(ex)
    }
}

export const getTotalReactionss = async(token,id)=>{
    try{
        let response = await axiosDAuthApiInstance(token).get(endpoints.getTotalReactions(id))
        return response.data
    }
    catch(ex){
        console.log(ex)
        throw(ex)
    }
}

export const getTotalReactionsAccountt = async(token,id)=>{
    try{
        let response = await axiosDAuthApiInstance(token).get(endpoints.getTotalReactionsAccount(id))
        return response.data
    }
    catch(ex){
        console.log(ex)
        throw(ex)
    }
}

export const addReactionss = async(token,dataReactions)=>{
    try{
        let response = await axiosDAuthApiInstance(token).post(endpoints.addReactions,dataReactions)
        return response.data
    }
    catch(ex){
        console.log(ex)
        throw(ex)
    }
}

export const updateReactionss = async(token,id,dataReactions)=>{
    try{
        let response = await axiosDAuthApiInstance(token).patch(endpoints.updateReactions(id),dataReactions)
        return response.data
    }
    catch(ex){
        console.log(ex)
        throw(ex)
    }
}

export const deleteReactionss = async(token,id)=>{
    try{
        let response = await axiosDAuthApiInstance(token).delete(endpoints.deleteReactions(id))
        return response.data
    }
    catch(ex){
        console.log(ex)
        throw(ex)
    }
}

export const deletePosts = async(token,id)=>{
    try{
        let response = await axiosDAuthApiInstance(token).delete(endpoints.deletePost(id))
        return response.data
    }
    catch(ex){
        console.log(ex)
        throw(ex)
    }
}



