<template>
  <navbar btnBackground="bg-gradient-success" />
  <div
    class="page-header align-items-start min-vh-100"
    style="
      background-image: url('https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80');
    "
  >
    <span class="mask bg-gradient-dark opacity-6"></span>
    <div class="container my-auto">
      <div class="row">
        <div class="col-lg-4 col-md-8 col-12 mx-auto">
          <div class="card z-index-0 fadeIn3 fadeInBottom">
            <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div
                class="
                  bg-gradient-success
                  shadow-success
                  border-radius-lg
                  py-3
                  pe-1
                "
              >
                <h4 class="text-white font-weight-bolder text-center mt-2 mb-0">
                  Đăng nhập
                </h4>
                <div class="row mt-2">
                  <div class="text-center me-auto">
                    <img
                      id="logo-app"
                      :src="logo"
                      class="navbar-brand-img h-20"
                      alt="main_logo"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div class="mb-3" v-if="ggMode == false">
                <material-input
                  id="password"
                  type="password"
                  label="Mã đăng nhập"
                  name="password"
                  :value="codePin"
                  @update:value="codePin = $event"
                  :success="validateCodePin"
                  :error="!validateCodePin"
                  @keypress.enter="onAdminLogin"
                />
              </div>

              <div class="text-center">
                <button
                  type="button"
                  class="login-with-google-btn"
                  @click="onLogin"
                  v-if="ggMode == true"
                >
                  Đăng nhập với Google
                </button>

                <material-button
                  v-else
                  class="mb-2"
                  variant="gradient"
                  color="success"
                  fullWidth
                  :disabled="!validateCodePin"
                  @click="onAdminLogin"
                  :active="true"
                  >Đăng nhập</material-button
                >
              </div>
              <div class="text-center" v-if="isNotTDTU">
                <span class="text-danger">Vui lòng sử dụng gmail TDTU!</span>
              </div>
            </div>
            <div class="nav-wrapper position-relative end-0">
              <ul class="nav nav-pills nav-fill p-1" role="tablist">
                <li class="nav-item">
                  <a
                    class="nav-link mb-0 px-0 py-1 active"
                    @click="ggMode = true"
                    data-bs-toggle="tab"
                    href="#"
                    role="tab"
                    aria-selected="false"
                    >Tài khoản google</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    @click="ggMode = false"
                    class="nav-link mb-0 px-0 py-1"
                    data-bs-toggle="tab"
                    href="#"
                    role="tab"
                    aria-selected="false"
                    >Mã đăng nhập</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/examples/PageLayout/Navbar.vue";
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import setNavPills from "@/assets/js/nav-pills.js";
import { mapMutations } from "vuex";
import logo from "@/assets/img/logo-ct.png";
import authService from "../api/login";

const gapi = window.gapi;

export default {
  name: "sign-in",
  inject: ["authData"],
  data() {
    return {
      accessToken: "",
      codePin: "",
      logo,
      ggMode: true,
      isNotTDTU: false,
    };
  },
  mounted() {
    setNavPills();
  },
  computed: {
    validateCodePin() {
      return this.codePin.trim() != "";
    },
  },
  components: {
    Navbar,
    MaterialInput,
    MaterialButton,
  },
  beforeCreate() {
    gapi.load("auth2", function () {});
  },
  beforeMount() {
    this.toggleEveryDisplay();
    this.toggleHideConfig();
  },
  beforeUnmount() {
    this.toggleEveryDisplay();
    this.toggleHideConfig();
  },
  watch: {
    async accessToken(newValue) {
      if (newValue != "") {
        try {
          const userData = await authService.getInfor(newValue);
          if (userData) {
            this.authData.setUser(userData.data);
            this.authData.setSignedIn(true);
            const redirect = this.$router.currentRoute._value.query.redirect;
            if (redirect) {
              this.$router.push({ path: redirect });
            } else {
              if (this.authData.isStudentRole()) {
                this.$router.push({ name: "Trang chủ" });
              } else if (this.authData.isAdminRole()) {
                this.$router.push({ name: "Quản lý người dùng" });
              } else {
                this.$router.push({ name: "Quản lý môn học" });
              }
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
  },
  methods: {
    ...mapMutations(["toggleEveryDisplay", "toggleHideConfig"]),
    onLogin() {
      gapi.auth2.authorize(
        {
          client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
          scope: "email profile openid",
          response_type: "id_token permission",
        },
        async (response) => {
          if (response.error) {
            // An error happened!
            console.log(response);
            return;
          }
          try {
            const { id_token } = response;
            const dataAuth = await authService.login(id_token);
            const { access_token } = dataAuth.data;
            this.accessToken = access_token;
            localStorage.setItem("access_token", this.accessToken);
            this.isNotTDTU = false;
          } catch (err) {
            if (err.response.status == 401) {
              this.isNotTDTU = true;
            }
          }
        }
      );
    },
    async onAdminLogin() {
      if (this.validateCodePin == true) {
        try {
          const dataAuth = await authService.loginAdmin(this.codePin);
          const { access_token } = dataAuth.data;

          this.accessToken = access_token;
          localStorage.setItem("access_token", this.accessToken);
        } catch (error) {
          console.log("wrong");
        }
        this.codePin = "";
      }
    },
  },
};
</script>


<style scoped lang="scss">
#logo-app {
  max-height: 4vmax;
}

.login-with-google-btn {
  transition: background-color 0.3s, box-shadow 0.3s;

  padding: 12px 16px 12px 42px;
  border: none;
  border-radius: 3px;
  box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 1px 1px rgba(0, 0, 0, 0.25);

  color: #757575;
  font-size: 14px;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;

  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=);
  background-color: white;
  background-repeat: no-repeat;
  background-position: 12px 11px;

  &:hover {
    box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.25);
  }

  &:active {
    background-color: #eeeeee;
  }

  &:focus {
    outline: none;
    box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.25),
      0 0 0 3px #c8dafc;
  }

  &:disabled {
    filter: grayscale(100%);
    background-color: #ebebeb;
    box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 1px 1px rgba(0, 0, 0, 0.25);
    cursor: not-allowed;
  }
}
</style>