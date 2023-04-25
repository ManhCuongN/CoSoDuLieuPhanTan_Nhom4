import MyAxios from "./index";

const axios = MyAxios.getMyAxios();

function get(query) {
  console.log(query);
  return axios.post(
    `${process.env.VUE_APP_URL_API_SERVICE}proposal/api/search`,
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
    `${process.env.VUE_APP_URL_API_SERVICE}proposal/api/${data._id}`,
    request,
    {
      headers: createBearerTokenHeader(),
    }
  );
}

function create(data) {
  const proposal = {
    idSubject: data.idSubject,
    title: data.title,
    description: data.description,
    requiredSkills: data.requiredSkills,
    plan: data.plan,
    idTeacher: data.idTeacher,
    filter: data.filter,
    idGroup: data.idGroup,
  };
  return axios.post(
    `${process.env.VUE_APP_URL_API_SERVICE}proposal/api`,
    proposal,
    {
      headers: createBearerTokenHeader(),
    }
  );
}

function updateStatus(data) {
  return axios.patch(
    `${process.env.VUE_APP_URL_API_SERVICE}proposal/api/${data._id}`,
    { action: data.isApproved, note: data.note, idTeacher: data.idTeacher },
    {
      headers: createBearerTokenHeader(),
    }
  );
}

function addNote(data) {
  return axios.patch(
    `${process.env.VUE_APP_URL_API_SERVICE}proposal/api/${data._id}/add-note`,
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
  create,
  updateStatus,
  addNote,
};
