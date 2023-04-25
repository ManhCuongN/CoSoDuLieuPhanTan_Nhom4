<template>
  <div class="card mb-4">
    <div class="card-header pb-0 px-3">
      <div class="d-flex justify-content-between">
        <div class="">
          <h6 class="mb-0">
            Danh sách sinh viên ({{ users.length }}/{{ totalInvitation }})
          </h6>
        </div>
        <div class="text-end hover mt-0">
          <i
            class="fas fa-user-plus me-2"
            aria-hidden="true"
            @click="onOpenAddingDialog"
          ></i>
        </div>
      </div>
    </div>
    <div class="card-body pt-4 p-3">
      <ul class="list-group">
        <li
          class="list-group-item border-0 ps-0 mb-2 border-radius-lg"
          v-for="user in users"
          :key="user"
        >
          <div class="d-flex align-items-center">
            <router-link
              :to="{
                name: 'Thông tin cá nhân',
                params: { idUser: user._id },
              }"
            >
              <material-avatar
                size="sm"
                shadow="shadow"
                :img="user.picture"
                :circular="true"
                alt="logo"
                referrerpolicy="no-referrer"
            /></router-link>

            <div class="px-2 d-flex flex-column">
              <h6 class="mb-1 text-dark text-sm">{{ user.displayName }}</h6>
              <span class="text-xs">{{ user.email }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div>
    <adding-students-schedule-dialog
      :students="students"
      :onAddStudents="onAddStudents"
      :idSubject="idSubject"
    />
  </div>
</template>

<script>
import MaterialAvatar from "@/components/MaterialAvatar.vue";
import AddingStudentsScheduleDialog from "./AddingStudentsScheduleDialog.vue";
import userService from "../../api/user";

const $ = window.$;
export default {
  name: "list-student",
  props: {
    students: Array,
    totalInvitation: Number,
    idSubject: String,
  },
  data() {
    return {
      users: [],
    };
  },
  methods: {
    onAddStudents() {
      this.$emit("update:students", true);
    },
    onOpenAddingDialog() {
      $("#addStudentscheduleDialog").modal("show");
    },
  },
  watch: {
    async students() {
      const users = await userService.get({
        _id: {
          $in: this.students,
        },
      });
      this.users = users.data;
    },
  },
  components: {
    MaterialAvatar,
    AddingStudentsScheduleDialog,
  },
};
</script>
