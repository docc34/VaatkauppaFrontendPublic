import axios from "axios";
 
const API_URL = 'https://vaatekauppayritysbackend.azurewebsites.net/api';
//Hoidetaan backendiin kutsuminen funktiolla käyttäen axiosta Näitä funktioita kutsutaan frontista ja niille annetaan oikeat tiedot.
const postPostService = async (postData) => {
    try {
      return await axios.post(`${API_URL}/store/posts`,postData);
    } catch (err) {
      return {
        error: true,
        response: err.response
      };
    }
  }
  const postDeleteService = async (postData) => {
    try {
      return await axios.delete(`${API_URL}/store/posts`,{
        headers: {
          
        },
        data: {
           e:postData
        }
      });
    } catch (err) {
      return {
        error: true,
        response: err.response
      };
    }
  }
  const postModifyService = async (modifyData) => {
    try {
      return await axios.put(`${API_URL}/store/posts`,modifyData);
    } catch (err) {
      return {
        error: true,
        response: err.response
      };
    }
  }
  const getJobPostListService = async (JobPostId) => {
    try {
      return await axios.get(`${API_URL}/store/posts/`+ JobPostId);
    } catch (err) {
      return {
        error: true,
        response: err.response
      };
    }
  }
  
export {postPostService, postDeleteService,postModifyService, getJobPostListService}
