import MyAxios from "./index";

const axios = MyAxios.getMyAxios();
function get(query) {
  return axios.post(
    `${process.env.VUE_APP_URL_API_SERVICE}event/api/search`,
    query,
    {
      headers: createBearerTokenHeader(),
    }
  );
}

function read() {
  return axios.post(
    `${process.env.VUE_APP_URL_API_SERVICE}event/api/read`,
    {},
    {
      headers: createBearerTokenHeader(),
    }
  );
}

function createBearerTokenHeader() {
  const accessToken = localStorage.getItem("access_token");
  return { Authorization: `Bearer ${accessToken}` };
}

export default {
  get,
  read,
};
