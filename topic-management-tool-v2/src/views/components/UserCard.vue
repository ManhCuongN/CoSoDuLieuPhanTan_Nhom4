<template>
  <div class="card">
    <div class="card-header pb-0">
      <h5>Danh sách người dùng</h5>
    </div>
    <div class="card-body px-0 pb-2">
      <div class="table-responsive">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th
                v-for="(heading, index) of headers"
                :key="index"
                :class="[
                  index === 0 ? 'ps-2' : '',
                  index >= 1 ? 'text-center' : '',
                ]"
                class="
                  text-uppercase text-secondary text-xxs
                  font-weight-bolder
                  opacity-7
                "
              >
                {{ heading }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(user, index) of users"
              :key="index"
              class="hover"
              @click="onOpenAccountDialog(user)"
            >
              <td>
                <div class="text-left">
                  <h6 class="mb-0 text-xs">{{ user.email }}</h6>
                </div>
              </td>
              <td>
                <div class="text-center">
                  <h6 class="mb-0 text-xs">{{ user.displayName }}</h6>
                </div>
              </td>
              <td>
                <div class="text-center">
                  <h6 class="mb-0 text-xs">
                    {{ roleUtil.mapRole(user.role) }}
                  </h6>
                </div>
              </td>
              <td>
                <div class="text-center" v-if="user.role == ROLE_STUDENT">
                  <a href="#" @click.stop="onDeleteStudent(user._id)">
                    <i class="material-icons py-2">delete_sweep</i></a
                  >
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div>
    <account-dialog :user="selectedUser" :onUpdateRole="onUpdateRole" />
  </div>
</template>

<script>
import AccountDialog from "./AccountDialog.vue";
import userService from "../../api/user";

import { ROLE_ADMIN, ROLE_STUDENT } from "../../constant/roleConstant";
const $ = window.$;
import roleUtil from "../../util/roleMapper";

export default {
  name: "UserCard",
  data() {
    return {
      users: [],
      headers: ["Email", "Họ và tên", "Vai trò", "Thao tác"],
      selectedUser: null,
      roleUtil,
      ROLE_STUDENT,
    };
  },
  beforeUnmount() {
    $("#accountDialog").modal("hide");
  },
  methods: {
    async onDeleteStudent(idUser) {
      const check = confirm(
        "Tất cả nhưng thông tin liên quan tới sinh viên sẽ bị xóa bao gồm cả các nhóm liên quan !!!"
      );
      if (check == true) {
        await userService.deleteUser(idUser);
        const users = await userService.get({ role: { $ne: ROLE_ADMIN } });
        this.users = users.data;
      }
    },
    onOpenAccountDialog(user) {
      this.selectedUser = user;
      $("#accountDialog").modal("show");
    },
    async onUpdateRole(idUser, newRole) {
      await userService.addRole(idUser, { role: newRole });
      const users = await userService.get({ role: { $ne: ROLE_ADMIN } });
      this.users = users.data;
    },
  },

  async created() {
    const users = await userService.get({ role: { $ne: ROLE_ADMIN } });
    this.users = users.data;
  },
  components: {
    AccountDialog,
  },
};
</script>


<style scoped>
tr {
  height: 53px !important;
}
</style>