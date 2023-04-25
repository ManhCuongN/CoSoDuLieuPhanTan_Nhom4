import MyAxios from "./index";

const axios = MyAxios.getMyAxios();

function get(query) {
  return axios.post(
    `${process.env.VUE_APP_URL_API_SERVICE}group/api/search`,
    query,
    {
      headers: createBearerTokenHeader(),
    }
  );
}

function create(data) {
  const group = {
    name: data.name,
    idUsers: data.idUsers,
  };
  return axios.post(`${process.env.VUE_APP_URL_API_SERVICE}group/api`, group, {
    headers: createBearerTokenHeader(),
  });
}

function update(data) {
  const group = {
    newName: data.newName,
  };
  return axios.patch(
    `${process.env.VUE_APP_URL_API_SERVICE}group/api/${data._id}`,
    group,
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
