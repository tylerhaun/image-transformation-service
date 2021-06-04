const axios = require("axios");
const stream = require("stream");
const qs = require("qs");
const FormData = require('form-data');
const fs = require("fs");


const axiosConfig = {
  baseURL: `http://localhost:${process.env.PORT}/`,
};
const apiRequest = axios.create(axiosConfig);


class ImageApi {

  async upload(imagePath) {

    const form = new FormData();
    form.append('file', fs.createReadStream(imagePath));

    const requestConfig = {
      headers: {
        ...form.getHeaders()
      }
    };
    const response = await apiRequest.post("images", form, requestConfig)
      .catch(error => {
        console.error(error.data)
        throw error;
      });
    return response.data;
    

  }

  async get(fileName, transformConfig) {

    const queryParams = qs.stringify(transformConfig);

    const fullUrl = `/images/${fileName}?${queryParams}`;
    const response = await apiRequest.get(fullUrl, {
      responseType: 'arraybuffer'
    })
      .catch(error => {
        console.error(error.data);
        throw error;
      })
    return response.data;
    
  }

}


module.exports = ImageApi;
