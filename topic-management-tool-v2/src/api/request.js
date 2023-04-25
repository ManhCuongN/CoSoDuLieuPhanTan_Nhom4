import MyAxios from "./index";

const axios = MyAxios.getMyAxios();

function get(query) {
  return axios.post(
    `${process.env.VUE_APP_URL_API_SERVICE}request/api/search`,
    query,
    {
      headers: createBearerTokenHeader(),
    }
  );
}

function update(data) {
  const request = {
    members: data.members,
    plan: data.plan,
  };
  return axios.put(
    `${process.env.VUE_APP_URL_API_SERVICE}request/api/${data._id}`,
    request,
    {
      headers: createBearerTokenHeader(),
    }
  );
}

function create(data) {
  return axios.post(
    `${process.env.VUE_APP_URL_API_SERVICE}request/api/create/${data.idTopic}`,
    data,
    {
      headers: createBearerTokenHeader(),
    }
  );
}

function updateStatus(data) {
  return axios.patch(
    `${process.env.VUE_APP_URL_API_SERVICE}request/api/${data._id}`,
    { status: data.status, note: data.note },
    {
      headers: createBearerTokenHeader(),
    }
  );
}

function addNote(data) {
  return axios.patch(
    `${process.env.VUE_APP_URL_API_SERVICE}request/api/${data._id}/add-note`,
    { note: data.note },
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
  updateStatus,
  addNote,
  create,
};
