import { axiosDAuthApiInstance } from "../api";

const endpoints = {
  'getRoomByAccount': (id) => `/room/${id}/filter_rooms/`, 
  'getMessbyRoom':(room_id)=> `/room/${room_id}/messages/`,
  'sendMess': '/message/'
};

// Lấy danh sách room chat theo ID
export const getRoomByAccount = async (token, id) => {
  try {
    let response = await axiosDAuthApiInstance(token).get(endpoints.getRoomByAccount(id))
    return response.data;
  } catch (ex) {
    console.error("Error in getRoomByAccount:", ex);
    throw ex;
  }
};

export const getMessbyRoom = async(token,room_id)=>{
  try{
    let response = await axiosDAuthApiInstance(token).get(endpoints.getMessbyRoom(room_id))
    return response.data;
  }catch(ex){
    console.error("Lỗi getMessByRoom",ex)
    throw ex;
  }
}
export const sendMess = async (token, content, who_sent, room) => {  
  try {
    let response = await axiosDAuthApiInstance(token).post(endpoints.sendMess, { 
      who_sent, 
      content, 
      room 
    });
    return response.data;
  } catch (ex) {
    console.error("Lỗi sendMess", ex);
    throw ex;
  }
};

