//Thêm mới

import { axiosDAuthApiInstance } from "../api";

const endpoints = {
    createSubscription: "/subscription/create/",
    processPayment: "/payment/process/",
    getPaymentHistory: "/payment/history/",
};

export const createSubscription = async (token, subscriptionData) => {
    try {
        let response = await axiosDAuthApiInstance(token).post(endpoints.createSubscription, subscriptionData);
        return response.data;
    } catch (ex) {
        console.log(ex);
        throw (ex);
    }
};

export const processPayment = async (token, paymentData) => {
    try {
        let response = await axiosDAuthApiInstance(token).post(endpoints.processPayment, paymentData);
        return response.data;
    } catch (ex) {
        console.log(ex);
        throw (ex);
    }
};

export const getPaymentHistory = async (token) => {
    try {
        let response = await axiosDAuthApiInstance(token).get(endpoints.getPaymentHistory);
        return response.data;
    } catch (ex) {
        console.log(ex);
        throw (ex);
    }
};