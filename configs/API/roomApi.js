import { axiosDAuthApiInstance } from "../api";

const endpoints = {
    'getRoomByAccount':(id) => `/room/${id}/filter_rooms/`,

}
// Lấy danh sách room chat theo ID
export const getRoomByAccount = async (token, id) => {
    try {
      const endpoint = endpoints.getRoomByAccount(id); // Tạo endpoint động
      const response = await axiosDAuthApiInstance(token).get(endpoint);
      return response.data;
    } catch (ex) {
      console.error("Error in getRoomByAccount:", ex);
      throw ex;
    }
  };