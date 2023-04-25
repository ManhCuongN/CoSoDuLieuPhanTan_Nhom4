import MyAxios from "./index";

const axios = MyAxios.getMyAxios();

function get() {
  return axios.get(
    `http://localhost:3000/user/api/student/result/khmt`,
    {
      headers: createBearerTokenHeader(),
    }
  );
}

function getKTMT() {
    return axios.get(
      `http://localhost:3000/user/api/student/result/ktmt`,
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

function update(id) {
  return axios.put(
    `http://localhost:3000/user/api/student/result/updateStatus`,
    {id},
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
  getKTMT,
  create,
  update,
};
