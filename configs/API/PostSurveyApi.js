import { axiosDAuthApiInstance } from "../api";
const endpoints = {
    'getAllPostSurvey': "/post_survey/",
    'addPostSurvey': "/post_survey/",
    'addQuestionPostSurvey':(post_id) => `/post_survey/${post_id}/create_survey_question/`,
    'getSurveyQuestion':(post_id) => `/post_survey/${post_id}/survey_question/`,
    'updatePostSurvey':(post_id) => `/post_survey/${post_id}/`,
    'updateSurveyQuestion':(post_id) => `/survey_question/${post_id}/`,
    'deletePostSurvey': (post_id) => `/post_survey/${post_id}/`,
    'submitSurveyAnswer': '/survey_answer',
    'checkSurveyCompleted':(post_id) => `/post_survey/${post_id}/check_survey_completed/`,
    'addSurveyResponse' : '/survey_response/',
    'getSurveyAnswers': '/survey-answer/',
}
export const getAllPostSurvey = async(token) => {
    try{
        let response = await axiosDAuthApiInstance(token).get(endpoints.getAllPostSurvey)
        return response.data
    } catch (ex) {
        console.log(ex)
        throw (ex)
    }
}
export const addPostSurvey = async(token , dataPostSurvey) => {
    try{
        let response = await axiosDAuthApiInstance(token).post(endpoints.addPostSurvey,dataPostSurvey)
        return response.data
    } catch (ex) {
        console.log(ex)
        throw (ex)
    }
}
export const addQuestionPostSurvey = async(token ,post_id, dataQuesPostSurvey) => {
    try{
        let response = await axiosDAuthApiInstance(token).post(endpoints.addQuestionPostSurvey(post_id),dataQuesPostSurvey)
        return response.data
    } catch (ex) {
        console.log(ex)
        throw (ex)
    }
}
export const getSurveyQuestion = async(token , post_id) => {
    try{
        let response = await axiosDAuthApiInstance(token).get(endpoints.getSurveyQuestion(post_id))
        return response.data
    } catch (ex) {
        console.log(ex)
        throw (ex)
    }
}
export const updatePostSurvey = async(token , post_id, dataPostSurvey) => {
    try{
        let response = await axiosDAuthApiInstance(token).patch(endpoints.updatePostSurvey(post_id),dataPostSurvey)
        return response.data
    } catch (ex) {
        console.log(ex)
        throw (ex)
    }
}
export const updateSurveyQuestion = async(token , post_id, dataPostSurvey) => {
    try{
        let response = await axiosDAuthApiInstance(token).patch(endpoints.updateSurveyQuestion(post_id),dataPostSurvey)
        return response.data
    } catch (ex) {
        console.log(ex)
        throw (ex)
    }
}
export const deletePostSurvey = async(token , post_id) => {
    try{
        let response = await axiosDAuthApiInstance(token).patch(endpoints.deletePostSurvey(post_id))
        return response.data
    } catch (ex) {
        console.log(ex)
        throw (ex)
    }
}
export const submitSurveyAnswer = async(token,surveyAnswerData) =>{
    try {
        let response = await axiosDAuthApiInstance(token).post(endpoints.submitSurveyAnswer, surveyAnswerData)
        return response.data
    }
    catch (ex) {
        console.log('Error submitting survey answer:', ex);
        throw ex;
}
}
export const checkSurveyCompleted = async(token,post_id,accountId)=> {
    try {
      const response = await axiosDAuthApiInstance(token).post(endpoints.checkSurveyCompleted(post_id), {
        account: accountId,
      });
      return response.data;
    } catch (ex) {
      console.log('Error checking survey completion:', ex);
      throw ex;
    }
  };

export const addSurveyResponse = async(token,responseData) =>{
    try{
        let reponse = await axiosDAuthApiInstance(token).post(endpoints.addPostSurvey,responseData)
        return reponse.data
    }
    catch (ex) {
        console.log('Error adding survey response:', ex);
        throw ex;
      }
}
export const getSurveyAnswers = async(token,post_id,accountId) => {
    try{
        const response = await axiosDAuthApiInstance(token).get(endpoints.getSurveyAnswers, {
            params: { survey_id: surveyId, account_id: accountId },
          });
          return response.data;
        } catch (ex) {
          console.log('Error getting survey answers:', ex);
          throw ex;
        }
      };
