import {
  ROLE_STUDENT,
  ROLE_TEACHER,
  ROLE_DEAN,
  ROLE_HD,
  ROLE_MANAGER,
} from "../constant/roleConstant";

function mapRole(role) {
  switch (role) {
    case ROLE_STUDENT:
      return "Sinh viên";
    case ROLE_TEACHER:
      return "Giảng viên";
    case ROLE_MANAGER:
      return "Giáo vụ";
    case ROLE_HD:
      return "Trưởng bộ môn";
    case ROLE_DEAN:
      return "Trưởng khoa";
  }
}

function get() {
  return [ROLE_STUDENT, ROLE_TEACHER, ROLE_DEAN, ROLE_HD, ROLE_MANAGER];
}

export default {
  mapRole,
  get,
};
