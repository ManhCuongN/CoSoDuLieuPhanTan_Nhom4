import MyAxios from "./index";

const axios = MyAxios.getMyAxios();

function get(query) {
  return axios.post(
    `${process.env.VUE_APP_URL_API_SERVICE}topic/api/search`,
    query,
    {
      headers: createBearerTokenHeader(),
    }
  );
}

function create(data) {
  const subject = {
    idSubject: data.idSubject,
    numMembers: data.numMembers,
    title: data.title,
    description: data.description,
    requiredSkills: data.requiredSkills,
    filter: data.filter,
    limit: data.limit,
    numRequests: data.numRequests,
    idGroup: data.idGroup,
  };
  return axios.post(
    `${process.env.VUE_APP_URL_API_SERVICE}topic/api`,
    subject,
    {
      headers: createBearerTokenHeader(),
    }
  );
}

function createByImport(data) {
  const subject = {
    topics: data.topics,
    idSubject: data.idSubject,
  };
  return axios.post(
    `${process.env.VUE_APP_URL_API_SERVICE}topic/api/import`,
    subject,
    {
      headers: createBearerTokenHeader(),
    }
  );
}

function update(data) {
  const subject = {
    idTopic: data.idTopic,
    title: data.title,
    description: data.description,
    requiredSkills: data.requiredSkills,
    filter: data.filter,
    limit: data.limit,
    numRequests: data.numRequests,
    numMembers: data.numMembers,
  };
  return axios.put(
    `${process.env.VUE_APP_URL_API_SERVICE}topic/api/${data._id}`,
    subject,
    {
      headers: createBearerTokenHeader(),
    }
  );
}

function addNote(data) {
  const subject = {
    note: data.note,
  };
  return axios.patch(
    `${process.env.VUE_APP_URL_API_SERVICE}topic/api/${data._id}`,
    subject,
    {
      headers: createBearerTokenHeader(),
    }
  );
}

function updateStatus(data) {
  const subject = {
    status: data.status,
  };
  return axios.patch(
    `${process.env.VUE_APP_URL_API_SERVICE}topic/api/update-status/${data._id}`,
    subject,
    {
      headers: createBearerTokenHeader(),
    }
  );
}

function deleteTopic({idTopic}) {
  return axios.delete(
    `${process.env.VUE_APP_URL_API_SERVICE}topic/api/${idTopic}`,
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
  deleteTopic,
  addNote,
  updateStatus,
  createByImport,
};
