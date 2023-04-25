const {
  ROLE_STUDENT,
  ROLE_TEACHER,
  ROLE_ADMIN,
  ROLE_MANAGER,
  ROLE_DEAN,
  ROLE_HD,
} = require("../constant/constant");
const { UNAUTHORIZED_MESSAGE } = require("../constant/errorMessage");

const verifyStudentPermission = (req, res, next) => {
  const { role } = req.user;
  if (verifyRole(role, ROLE_STUDENT)) {
    next();
  } else {
    next(UNAUTHORIZED_MESSAGE);
  }
};

const verifyTeacherPermission = (req, res, next) => {
  const { role } = req.user;
  if (verifyRole(role, ROLE_TEACHER)) {
    next();
  } else {
    next(UNAUTHORIZED_MESSAGE);
  }
};

const verifyDeanOrHDOrTeacherPermission = (req, res, next) => {
  const { role } = req.user;
  if (
    verifyRole(role, ROLE_DEAN) ||
    verifyRole(role, ROLE_HD) ||
    verifyRole(role, ROLE_TEACHER)
  ) {
    next();
  } else {
    next(UNAUTHORIZED_MESSAGE);
  }
};

const verifyDeanOrHDOrTeacherOrManagerPermission = (req, res, next) => {
  const { role } = req.user;
  if (
    verifyRole(role, ROLE_DEAN) ||
    verifyRole(role, ROLE_HD) ||
    verifyRole(role, ROLE_TEACHER) ||
    verifyRole(role, ROLE_MANAGER)
  ) {
    next();
  } else {
    next(UNAUTHORIZED_MESSAGE);
  }
};

const verifyDeanOrHDPermission = (req, res, next) => {
  const { role } = req.user;
  if (verifyRole(role, ROLE_DEAN) || verifyRole(role, ROLE_HD)) {
    next();
  } else {
    next(UNAUTHORIZED_MESSAGE);
  }
};

const verifyManagerPermission = (req, res, next) => {
  const { role } = req.user;
  if (verifyRole(role, ROLE_MANAGER)) {
    next();
  } else {
    next(UNAUTHORIZED_MESSAGE);
  }
};

const verifyAdminPermission = (req, res, next) => {
  const { role } = req.user;
  if (verifyRole(role, ROLE_ADMIN)) {
    next();
  } else {
    next(UNAUTHORIZED_MESSAGE);
  }
};

const verifyRole = (role, permission) => {
  return role && role == permission;
};

module.exports = {
  verifyStudentPermission,
  verifyTeacherPermission,
  verifyAdminPermission,
  verifyManagerPermission,
  verifyDeanOrHDOrTeacherPermission,
  verifyDeanOrHDPermission,
  verifyDeanOrHDOrTeacherOrManagerPermission,
};
