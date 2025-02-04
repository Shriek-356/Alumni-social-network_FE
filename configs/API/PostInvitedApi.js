import { axiosDAuthApiInstance } from "../api";
const endpoints = { 
    'createPostInvited': '/post_invitations/',
    'invitedMembers':(post_invited_id) => `/post_invitations/${post_invited_id}/alumni/`,
    'invitedGroups':(post_invited_id) => `/post_invitations/${post_invited_id}/invite_group/`,
    'invitedAll':(post_invited_id) =>  `/post_invitations/${post_invited_id}/invite_all/`,
    'createdGroup': '/group/',
    'getAllGroup':'/group/',


}
export const createPostInvited = async(token ,data)=>{
    try{
        let response = await axiosDAuthApiInstance(token).post(endpoints.createPostInvited ,data)
        return response.data
    } catch (ex) {
        console.log(ex)
        throw (ex)
    }
    }
export const invitedMembers = async(token ,post_invited_id,list_alumni_id)=>{
    try{
        let response = await axiosDAuthApiInstance(token).post(endpoints.invitedMembers(post_invited_id) ,{list_alumni_id} ) // đóng gói vào Objects JSON
        return response.data
    } catch (ex) {
        console.log(ex)
        throw (ex)
    }
    }
export const invitedGroups = async(token ,post_invited_id,group_ids)=>{
        try{
            let response = await axiosDAuthApiInstance(token).post(endpoints.invitedGroups(post_invited_id) ,{group_ids})
            return response.data
        } catch (ex) {
            console.log(ex)
            throw (ex)
        }
        }
export const createdGroup = async(token,data)=>{
        try{
            let response = await axiosDAuthApiInstance(token).post(endpoints.createdGroup,data)
            return response.data
        } catch (ex) {
            console.log(ex)
            throw (ex)
        }
        }
export const getAllGroup = async(token) => {
    try{
        let response = await axiosDAuthApiInstance(token).get(endpoints.getAllGroup)
        return response.data
    }catch(ex){
        console.log(ex)
        throw(ex)
    }
}

