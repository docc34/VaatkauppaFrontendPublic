import axios from "axios";
 
const API_URL = 'https://vaatekauppayritysbackend.azurewebsites.net/api';
 
//Hoidetaan backendiin kutsuminen funktiolla käyttäen axiosta Näitä funktioita kutsutaan frontista ja niille annetaan oikeat tiedot.

const getProfileListService = async (userId) => {
  try {
    return await axios.get(`${API_URL}/profile/basicInfo/`+ userId);
  } catch (err) {
    return {
      error: true,
      response: err.response
    };
  }
}
const setProfileListService = async (profileData) => {
  try {
    return await axios.put(`${API_URL}/profile/basicInfo`,profileData);
  } catch (err) {
    return {
      error: true,
      response: err.response
    };
  }
}
const postProfileEducationAddService = async (educationData) => {
  try {
    return await axios.post(`${API_URL}/profile/education`,educationData);
  } catch (err) {
    return {
      error: true,
      response: err.response
    };
  }
}
const postProfileJobsAddService = async (jobsData) => {
  try {
    return await axios.post(`${API_URL}/profile/jobs`,jobsData);
  } catch (err) {
    return {
      error: true,
      response: err.response
    };
  }
}

const deleteProfileJobsService = async (jobsData) => {
  try {
    return await axios.delete(`${API_URL}/profile/jobs`,{
      headers: {
        
      },
      data: {
         e:{jobsId: jobsData.jobsId, userId: jobsData.userId}
      }
    });
  } catch (err) {
    return {
      error: true,
      response: err.response
    };
  }
}

const deleteProfileEducationService = async (jobsData) => {
  try {
    return await axios.delete(`${API_URL}/profile/education`,{
      headers: {
        
      },
      data: {
         e:{educationId: jobsData.educationId, userId: jobsData.userId}
      }
    });
  } catch (err) {
    return {
      error: true,
      response: err.response
    };
  }
}
const postProfilePictureService = async (dataFile, userId) => {
 
  try {
     return await axios.post(`${API_URL}/profiles/img/`+userId,dataFile )
    //.then(response => {
    //   this.setState({
    //     handleResponse: {
    //       isSuccess: response.status === 200,
    //       message: response.data.message
    //     },
    //     imageUrl: BASE_URL + response.data.file.path
    //   });
    // }).catch(err => {
    //   alert(err.message);
    // });
  } catch (err) {
    return {
      error: true,
      response: err.response
    };
  }
}


export {getProfileListService, 
  setProfileListService,
  postProfileEducationAddService, 
  postProfileJobsAddService, 
  deleteProfileJobsService, 
  deleteProfileEducationService, 
  postProfilePictureService}
