import { reactive, readonly } from "vue";
import {
  ROLE_STUDENT,
  ROLE_TEACHER,
  ROLE_ADMIN,
  ROLE_MANAGER,
  ROLE_HD,
  ROLE_DEAN,
} from "../constant/roleConstant";

const state = reactive({
  user: {
    email: "",
    givenName: "",
    familyName: "",
    displayName: "",
    major: "",
    class: "",
    phone: "",
    picture: "",
    skills: "",
    role: "",
    _id: "",
  },
  isSignedIn: false,
});

const isHavePermission = (roles) => {
  if (roles && roles.length != 0) {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i] == state.user.role) {
        return true;
      }
    }
    return false;
  }
  return true;
};

const setUser = function (user) {
  state.user = { ...user };
};

const isTeacherRole = () => {
  return state.user.role == ROLE_TEACHER;
};
const isStudentRole = () => {
  return state.user.role == ROLE_STUDENT;
};
const isAdminRole = () => {
  return state.user.role == ROLE_ADMIN;
};
const isManagerRole = () => {
  return state.user.role == ROLE_MANAGER;
};
const isHDRole = () => {
  return state.user.role == ROLE_HD;
};
const isDeanRole = () => {
  return state.user.role == ROLE_DEAN;
};

const setSignedIn = function (isSignedIn) {
  state.isSignedIn = isSignedIn;
};

const signOut = function () {
  state.user = {
    email: "",
    givenName: "",
    familyName: "",
    displayName: "",
    major: "",
    class: "",
    phone: "",
    picture: "",
    role: "",
    _id: "",
  };
  state.isSignedIn = false;
};

export default {
  state: readonly(state),
  setUser,
  setSignedIn,
  isTeacherRole,
  signOut,
  isHavePermission,
  isAdminRole,
  isStudentRole,
  isManagerRole,
  isHDRole,
  isDeanRole,
};
