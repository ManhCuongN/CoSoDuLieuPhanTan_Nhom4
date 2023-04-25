<template>
  <div
    class="modal fade"
    id="departmentDialog"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalMessageTitle"
    aria-hidden="true"
    v-if="department"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title font-weight" id="exampleModalLabel">
            {{ department.title }}
          </h6>
          <button
            type="button"
            class="btn-close text-dark"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div class="modal-body">
          <material-input
            type="text"
            size="lg"
            label="Tên bộ môn"
            :value="title"
            @update:value="title = $event"
            :success="validateTitle"
            :error="!validateTitle"
          />
          <div
            class="input-group input-group-outline d-block my-2"
            :class="validateIdUser == true ? 'is-valid' : 'is-invalid'"
          >
            <label for="select-role" class="ms-0">Chọn người quản lý</label>
            <select
              class="form-control w-100"
              id="select-role"
              v-model="idUser"
            >
              <option
                :value="user._id"
                v-for="user in users"
                :key="user"
                :selected="idUser == user._id"
              >
                {{ user.displayName }}
              </option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn bg-gradient-secondary"
            data-bs-dismiss="modal"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            class="btn bg-gradient-warning"
            :disabled="
              department.owner &&
              idUser == department.owner._id &&
              title == department.title
            "
            @click="onClick"
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import userService from "../../api/user";
import { ROLE_HD } from "../../constant/roleConstant";
import MaterialInput from "../../components/MaterialInput.vue";
const $ = window.$;

export default {
  name: "DepartmentDialog",
  data() {
    return {
      idUser: "",
      users: [],
      title: "",
    };
  },
  computed: {
    validateIdUser() {
      return this.idUser.trim() != "";
    },
    validateTitle() {
      return this.title.trim() != "";
    },
  },
  props: {
    department: Object,
    onUpdateDepartment: Function,
  },
  watch: {
    async department() {
      const users = await userService.get({ role: ROLE_HD });
      this.users = users.data;
      this.idUser = this.department.owner ? this.department.owner._id : "";
      this.title = this.department.title;
    },
  },
  methods: {
    onClick() {
      this.onUpdateDepartment(this.department._id, this.idUser, this.title);
      this.idUser = "";
      this.title = "";
      $("#departmentDialog").modal("hide");
    },
  },
  components: { MaterialInput },
};
</script>