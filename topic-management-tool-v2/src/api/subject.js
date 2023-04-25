import MyAxios from "./index";

const axios = MyAxios.getMyAxios();

function get(query) {
  return axios.post(
    `${process.env.VUE_APP_URL_API_SERVICE}subject/api/search`,
    query,
    {
      headers: createBearerTokenHeader(),
    }
  );
}

function create(data) {
  const subject = {
    title: data.title,
    limitRequest: data.limitRequest,
  };
  return axios.post(
    `${process.env.VUE_APP_URL_API_SERVICE}subject/api`,
    subject,
    {
      headers: createBearerTokenHeader(),
    }
  );
}

function update(data) {
  const subject = {
    title: data.title,
    closeStatus: data.closeStatus,
    from: data.range.from,
    to: data.range.to,
    limitRequest: data.limitRequest,
  };
  return axios.put(
    `${process.env.VUE_APP_URL_API_SERVICE}subject/api/${data._id}`,
    subject,
    {
      headers: createBearerTokenHeader(),
    }
  );
}

function getGeneralInfo(data) {
  return axios.get(
    `${process.env.VUE_APP_URL_API_SERVICE}subject/api/${data._id}`,
    {
      headers: createBearerTokenHeader(),
    }
  );
}

function createSchedule(data) {
  let fromDate = new Date(data.from);
  let toDate = new Date(data.to);
  fromDate.setHours(fromDate.getHours() - 7);
  toDate.setHours(toDate.getHours() - 7);
  const subject = {
    from: fromDate,
    to: toDate,
    idUsers: data.idUsers,
    emails: data.emails,
  };
  return axios.post(
    `${process.env.VUE_APP_URL_API_SERVICE}subject/api/schedule/${data._id}`,
    subject,
    {
      headers: createBearerTokenHeader(),
    }
  );
}

function addStudents(data) {
  const subject = {
    idUsers: data.idUsers,
  };

  return axios.post(
    `${process.env.VUE_APP_URL_API_SERVICE}subject/api/schedule/add-students/${data._id}`,
    subject,
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
  getGeneralInfo,
  createSchedule,
  addStudents,
};
