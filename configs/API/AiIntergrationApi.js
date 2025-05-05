import { axiosDAuthApiInstance } from "../api";

const endpoints = {
    generatePost: "/ai/generate_post/",
    generateSurvey: "/ai/generate_survey/",
    checkSubscription: "/ai/check_subscription/",
    subscribe: "/ai/subscribe/"
}

export const generatePost = async (token, topic) => {
    try {
        let response = await axiosDAuthApiInstance(token).post(endpoints.generatePost, { topic })
        return response.data
    } catch (ex) {
        console.log(ex)
        throw (ex)
    }
}

export const generateSurvey = async (token, surveyData) => {
    try {
        let response = await axiosDAuthApiInstance(token).post(endpoints.generateSurvey, surveyData)
        return response.data
    } catch (ex) {
        console.log(ex)
        throw (ex)
    }
}

export const checkSubscription = async (token) => {
    try {
        let response = await axiosDAuthApiInstance(token).get(endpoints.checkSubscription)
        return response.data
    } catch (ex) {
        console.log(ex)
        throw (ex)
    }
}

export const subscribe = async (token, subscriptionData) => {
    try {
        let response = await axiosDAuthApiInstance(token).post(endpoints.subscribe, subscriptionData)
        return response.data
    } catch (ex) {
        console.log(ex)
        throw (ex)
    }
}