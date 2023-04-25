import MyAxios from "./index";

const axios = MyAxios.getMyAxios();

function login(idToken) {
  return axios.post(`${process.env.VUE_APP_URL_API_SERVICE}auth/google`, {
    id_token: idToken,
  });
}

function loginAdmin(admin_id) {
  return axios.post(`${process.env.VUE_APP_URL_API_SERVICE}auth/admin`, {
    admin_id,
  });
}

function getInfor() {
  return axios.get(`${process.env.VUE_APP_URL_API_SERVICE}user/api`, {
    headers: createBearerTokenHeader(),
  });
}

function refreshAccessToken(refreshToken) {
  return axios.post(
    `${process.env.VUE_APP_URL_API_SERVICE}auth/google/refresh`,
    {
      refresh_token: refreshToken,
    }
  );
}

function createBearerTokenHeader() {
  const accessToken = localStorage.getItem("access_token");
  return { Authorization: `Bearer ${accessToken}` };
}

export default {
  login,
  loginAdmin,
  getInfor,
  refreshAccessToken,
};
