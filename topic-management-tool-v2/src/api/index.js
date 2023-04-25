import axios from "axios";

class MyAxios {
  static appData;
  static rest = axios.create({
    baseURL: process.env.VUE_APP_URL_API_SERVICE,
  });
  static initialAxios(appData) {
    MyAxios.appData = appData;

    MyAxios.rest.interceptors.request.use(
      function (config) {
        // Do something before request is sent
        MyAxios.appData.setLoading(true);
        return config;
      },
      function (error) {
        MyAxios.appData.setLoading(false);
        // Do something with request error
        return Promise.reject(error);
      }
    );

    MyAxios.rest.interceptors.response.use(
      function (response) {
        MyAxios.appData.setLoading(false);
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
      },
      function (error) {
        MyAxios.appData.setLoading(false);
        // if (error.response.status == 401) {
        //   if (document.location.pathname != "/sign-in") {
        //     document.location.href = "/sign-in";
        //   }
        // }

        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
      }
    );
  }

  static getMyAxios() {
    return MyAxios.rest;
  }
}

export default MyAxios;
