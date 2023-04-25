import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import authData from "./data/authData";
import appData from "./data/appData";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import MaterialDashboard from "./material-dashboard";
import authService from "./api/login";
import MyAxios from "./api/index";

router.beforeEach(async (to, from) => {
  if (to.meta.requiresAuth) {
    if (to.name == "Trang chủ") {
      if (
        authData.state.isSignedIn &&
        !authData.isHavePermission(to.meta.roles)
      ) {
        if (authData.isAdminRole()) {
          return { name: "Quản lý người dùng" };
        } else {
          return { name: "Quản lý môn học" };
        }
      }
    }
    if (
      !authData.state.isSignedIn ||
      !authData.isHavePermission(to.meta.roles)
    ) {
      return {
        path: "/sign-in",
        query: { redirect: to.path },
      };
    }
  } else {
    if (to.name == "Đăng nhập") {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken && accessToken != "") {
        try {
          const userData = await authService.getInfor();

          if (userData) {
            authData.setUser(userData.data);
            authData.setSignedIn(true);

            if (from.name == null) {
              const redirect = to.query.redirect;

              if (redirect) {
                return {
                  path: redirect,
                };
              }
            } else {
              return false;
            }
          }
        } catch (err) {
          return true;
        }
      }
    }
  }
});

const appInstance = createApp(App);

appInstance.provide("appData", appData);
appInstance.provide("authData", authData);
appInstance.use(store);
appInstance.use(router);
appInstance.use(MaterialDashboard);

MyAxios.initialAxios(appData);

appInstance.mount("#app");
