import { axiosDAuthApiInstance } from "../api"


const endpoints = {
    'getRoombyAccount': (id) => `/room/${id}/filter_rooms/`,
    'createMultipleRooms': "/room/create_multiple_rooms/",
}

export const getRoombyAccount = async(id,token) => { //lay id cua nguoi dung hien tai
    try{
        const response = await axiosDAuthApiInstance(token).get(endpoints.getRoombyAccount(id))
        return response.data; 

    }catch(ex){
        console.error(ex);
        throw ex;
    }
};
export const createMultipleRooms = async(firstUserId, token) => {
    try {
        const response = await axiosDAuthApiInstance(token).post(endpoints.createMultipleRooms, {
          first_user_id: firstUserId //nguoi dung hien tai
        });
        return response.data;
      } catch (ex) {
        console.error(ex);
        throw ex;
      }
    };