import MyAxios from "./index";

const axios = MyAxios.getMyAxios();

function get(query) {
  return axios.post(
    `${process.env.VUE_APP_URL_API_SERVICE}department/api/search`,
    query,
    {
      headers: createBearerTokenHeader(),
    }
  );
}

function create(data) {
  const department = {
    title: data.title,
  };
  return axios.post(
    `${process.env.VUE_APP_URL_API_SERVICE}department/api`,
    department,
    {
      headers: createBearerTokenHeader(),
    }
  );
}

function update(data) {
  const department = {
    owner: data.owner,
    title: data.title,
  };
  return axios.put(
    `${process.env.VUE_APP_URL_API_SERVICE}department/api/${data.idDepartment}`,
    department,
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
  create,
  update,
};
