import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Group from "../views/Group.vue";
import Notifications from "../views/Notifications.vue";
import Profile from "../views/Profile.vue";
import SignIn from "../views/SignIn.vue";
import Register from "../views/Register.vue";
import SubjectManagement from "../views/SubjectManagement.vue";
import ManageTopic from "../views/ManageTopic.vue";
import Request from "../views/Request.vue";
import Schedule from "../views/Schedule.vue";
import ManageSchedule from "../views/ManageSchedule.vue";
import {
  ROLE_STUDENT,
  ROLE_TEACHER,
  ROLE_DEAN,
  ROLE_HD,
  ROLE_MANAGER,
  ROLE_ADMIN,
} from "../constant/roleConstant";
import ManageUser from "../views/ManageUser.vue";
import ManageDepartment from "../views/ManageDepartment.vue";
import ManageDepartmentCopy from "../views/ManageDepartmentCopy.vue";
import ManageDepartmentCopyTwo from "../views/ManageDepartmentCopyTwo.vue";


// import Loading from "../views/Loading.vue";

const routes = [
  // {
  //   path: "/loading",
  //   name: "Loading",
  //   component: Loading,
  // },
  {
    path: "/",
    name: "/",
    redirect: "/dashboard",
    meta: { requiresAuth: true, roles: [ROLE_STUDENT] },
  },
  {
    path: "/dashboard",
    name: "Trang chủ",
    component: Dashboard,
    meta: { requiresAuth: true, roles: [ROLE_STUDENT] },
  },
  {
    path: "/manage-subject",
    name: "Quản lý môn học",
    component: SubjectManagement,
    meta: {
      requiresAuth: true,
      roles: [ROLE_TEACHER, ROLE_DEAN, ROLE_MANAGER, ROLE_HD],
    },
  },
  {
    path: "/manage-subject-2",
    name: "Quản lý môn học 2 ",
    component: SubjectManagement,
    meta: {
      requiresAuth: true,
      roles: [ROLE_TEACHER, ROLE_DEAN, ROLE_MANAGER, ROLE_HD],
    },
  },
  {
    path: "/request",
    name: "Yêu cầu xét duyệt",
    component: Request,
    meta: { requiresAuth: true, roles: [ROLE_STUDENT] },
  },
  {
    path: "/manage-user",
    name: "Quản lý người dùng",
    component: ManageUser,
    meta: { requiresAuth: true, roles: [ROLE_ADMIN] },
  },
  {
    path: "/department",
    name: "Bộ môn",
    component: ManageDepartment,
    meta: { requiresAuth: true, roles: [ROLE_ADMIN] },
  },
  {
    path: "/list-topic-khmt",
    name: "Khoa học máy tính",
    component: ManageDepartmentCopy,
    meta: { requiresAuth: true, roles: [ROLE_MANAGER]}
  },
  {
    path: "/list-topic-ktmt",
    name: "Kỹ thuật máy tính",
    component: ManageDepartmentCopyTwo,
    meta: { requiresAuth: true, roles: [ROLE_MANAGER]}
  },
  {
    path: "/list-topic-ktmts",
    name: "Kỹ thuật máy tínhs",
    meta: { requiresAuth: true, roles: [ROLE_MANAGER]}
  },
  {
    path: "/group",
    name: "Nhóm",
    component: Group,
    meta: { requiresAuth: true, roles: [ROLE_STUDENT] },
  },

  {
    path: "/notifications",
    name: "Thông báo",
    component: Notifications,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "Thông tin",
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/preview",
    name: "Thông tin cá nhân",
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/sign-in",
    name: "Đăng nhập",
    component: SignIn,
  },
  {
    path: "/register",
    name: "Đăng ký đề tài",
    component: Register,
    meta: { requiresAuth: true, roles: [ROLE_STUDENT] },
  },
  {
    path: "/manage-topic",
    name: "Quản lý đề tài",
    component: ManageTopic,
    meta: {
      requiresAuth: true,
      roles: [ROLE_TEACHER, ROLE_DEAN, ROLE_MANAGER, ROLE_HD],
    },
  },

  {
    path: "/manage-schedule",
    name: "Quản lý đợt đăng ký",
    component: ManageSchedule,
    meta: {
      requiresAuth: true,
      roles: [ROLE_MANAGER],
    },
  },
  {
    path: "/schedule",
    name: "Tạo đợt đăng ký đề tài",
    component: Schedule,
    meta: {
      requiresAuth: true,
      roles: [ROLE_MANAGER],
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
