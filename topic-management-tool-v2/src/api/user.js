import MyAxios from "./index";

const axios = MyAxios.getMyAxios();

function get(query) {
  return axios.post(
    `${process.env.VUE_APP_URL_API_SERVICE}user/api/search`,
    query,
    {
      headers: createBearerTokenHeader(),
    }
  );
}

function update(data) {
  const user = {
    givenName: data.givenName,
    familyName: data.familyName,
    major: data.major,
    class: data.class,
    phone: data.phone,
    skills: data.skills,
  };
  return axios.put(
    `${process.env.VUE_APP_URL_API_SERVICE}user/api/update`,
    user,
    {
      headers: createBearerTokenHeader(),
    }
  );
}

function addRole(idUser, data) {
  return axios.put(
    `${process.env.VUE_APP_URL_API_SERVICE}user/api/add-role/${idUser}`,
    data,
    {
      headers: createBearerTokenHeader(),
    }
  );
}

function deleteUser(idUser) {
  return axios.delete(
    `${process.env.VUE_APP_URL_API_SERVICE}user/api/${idUser}`,
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
  update,
  addRole,
  deleteUser,
};
