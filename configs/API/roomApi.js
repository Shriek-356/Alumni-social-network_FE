import { axiosDAuthApiInstance } from "../api";

const endpoints = {
  'getRoomByAccount': (id) => `/room/${id}/filter_rooms/`, // Đảm bảo ID được thay vào đúng chỗ
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
