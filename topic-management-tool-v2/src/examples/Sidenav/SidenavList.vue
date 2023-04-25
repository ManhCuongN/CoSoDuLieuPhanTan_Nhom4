<template>
  <div
    class="w-auto h-auto collapse navbar-collapse max-height-vh-100 h-100"
    id="sidenav-collapse-main"
  >
    <ul class="navbar-nav">
      <li class="nav-item" v-if="authData.isHavePermission([ROLE_STUDENT])">
        <sidenav-collapse
          url="#"
          :aria-controls="''"
          v-bind:collapse="false"
          collapseRef="dashboard"
          navText="Trang chủ"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
        </sidenav-collapse>
      </li>

      <li
        class="nav-item"
        v-if="
          authData.isHavePermission([
            ROLE_TEACHER,
            ROLE_DEAN,
            ROLE_MANAGER,
            ROLE_HD,
          ])
        "
      >
        <sidenav-collapse
          url="#"
          :aria-controls="''"
          v-bind:collapse="false"
          collapseRef="manage-subject"
          navText="Quản lý môn học"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item" v-if="authData.isHavePermission([ROLE_MANAGER])">
        <sidenav-collapse
          url="#"
          :aria-controls="''"
          v-bind:collapse="false"
          collapseRef="schedule"
          navText="Tạo đợt đăng ký môn học"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">event_available</i>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item" v-if="authData.isHavePermission([ROLE_MANAGER])">
        <sidenav-collapse
          url="#"
          :aria-controls="''"
          v-bind:collapse="false"
          collapseRef="list-topic-khmt"
          navText="Khoa học máy tính"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">event_available</i>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item" v-if="authData.isHavePermission([ROLE_MANAGER])">
        <sidenav-collapse
          url="#"
          :aria-controls="''"
          v-bind:collapse="false"
          collapseRef="list-topic-ktmt"
          navText="Kỹ thuật máy tính"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">event_available</i>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item" v-if="authData.isHavePermission([ROLE_MANAGER])">
        <sidenav-collapse
          url="#"
          :aria-controls="''"
          v-bind:collapse="false"
          collapseRef="list-topic-ktmt2"
          navText="Khoa Kinh Tế"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">event_available</i>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item" v-if="authData.isHavePermission([ROLE_MANAGER])">
        <sidenav-collapse
          url="#"
          :aria-controls="''"
          v-bind:collapse="false"
          collapseRef="list-topic-ktmt3"
          navText="Khoa Khoa Học Dữ Liệu"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">event_available</i>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item" v-if="authData.isHavePermission([ROLE_ADMIN])">
        <sidenav-collapse
          url="#"
          :aria-controls="''"
          v-bind:collapse="false"
          collapseRef="manage-user"
          navText="Quản lý người dùng"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">manage_accounts</i>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item" v-if="authData.isHavePermission([ROLE_STUDENT])">
        <sidenav-collapse
          url="#"
          :aria-controls="''"
          v-bind:collapse="false"
          collapseRef="request"
          navText="Yêu cầu xét duyệt"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">table_view</i>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item" v-if="authData.isHavePermission([ROLE_ADMIN])">
        <sidenav-collapse
          url="#"
          :aria-controls="''"
          v-bind:collapse="false"
          collapseRef="department"
          navText="Bộ môn"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">apartment</i>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item" v-if="authData.isHavePermission([ROLE_STUDENT])">
        <sidenav-collapse
          url="#"
          :aria-controls="''"
          v-bind:collapse="false"
          collapseRef="group"
          navText="Nhóm"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">groups_3</i>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item" @click="updateNumEvents()">
        <sidenav-collapse
          url="#"
          :aria-controls="''"
          v-bind:collapse="false"
          collapseRef="notifications"
          navText="Thông báo"
        >
          <template v-slot:icon>
            <div class="position-relative">
              <i class="material-icons-round opacity-10 fs-5">notifications </i
              ><sup
                ><span class="badge badge-success text-sm text-warning">{{
                  events.length
                }}</span></sup
              >
            </div>
          </template>
        </sidenav-collapse>
      </li>
      <li class="mt-3 nav-item">
        <h6
          class="text-xs ps-4 text-uppercase font-weight-bolder text-white ms-2"
        >
          Tài khoản
        </h6>
      </li>
      <li class="nav-item">
        <sidenav-collapse
          url="#"
          :aria-controls="''"
          v-bind:collapse="false"
          collapseRef="profile"
          navText="Thông tin"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">person</i>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse
          url="#"
          :aria-controls="''"
          v-bind:collapse="false"
          collapseRef="sign-in"
          navText="Đăng xuất"
          @click="signOut"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">logout</i>
          </template>
        </sidenav-collapse>
      </li>
    </ul>
  </div>
</template>
<script>
import SidenavCollapse from "./SidenavCollapse.vue";
import eventService from "../../api/event";
import {
  ROLE_STUDENT,
  ROLE_TEACHER,
  ROLE_DEAN,
  ROLE_HD,
  ROLE_MANAGER,
  ROLE_ADMIN,
} from "../../constant/roleConstant";
import { STATUS_NEW } from "../../constant/statusConstant";

export default {
  name: "SidenavList",
  inject: ["authData"],
  props: {
    cardBg: String,
  },
  data() {
    return {
      ROLE_STUDENT,
      ROLE_TEACHER,
      ROLE_DEAN,
      ROLE_HD,
      ROLE_MANAGER,
      ROLE_ADMIN,
      events: [],
      idUser: "",
    };
  },
  async created() {
    this.getEvents();
  },
  async updated() {
    this.getEvents();
  },
  methods: {
    signOut() {
      localStorage.clear();
    },
    updateNumEvents() {
      this.events = [];
    },
    async getEvents() {
      if (this.authData.state.user._id != "") {
        this.idUser = this.authData.state.user._id;
        const events = await eventService.get({
          status: STATUS_NEW,
          userId: this.idUser,
        });
        this.events = events.data;
      }
    },
  },
  components: {
    SidenavCollapse,
  },
};
</script>


<style scoped lang="scss">
sup {
  top: -1.5em;
  left: -1.5em;
  position: absolute;
  line-height: 0;
  vertical-align: baseline;
}
</style>