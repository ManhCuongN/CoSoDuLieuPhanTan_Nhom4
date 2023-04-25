<template>
  <div class="card">
    <div class="card-header pb-0">
      <div class="d-flex justify-content-between">
        <h5>Danh sách bộ môn</h5>
        <a class="hover" @click="onOpenCreatingDialog">
          <i class="material-icons-round opacity-10 fs-5">domain_add</i>
        </a>
      </div>
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
                  text-uppercase text-secondary text-xs
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
              v-for="(department, index) of departments"
              :key="index"
              class="hover"
              @click="onOpenUpadtingDialog(department)"
            >
              <td>
                <div class="text-left">
                  <h6 class="mb-0 text-xs">{{ department.title }}</h6>
                </div>
              </td>
              <td>
                <div class="text-center" v-if="department.owner">
                  <h6 class="mb-0 text-xs">
                    {{ department.owner.displayName }}
                  </h6>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div>
    <department-creating-dialog :onCreatingDepartment="onCreatingDepartment" />
    <department-dialog
      :department="selectedDepartment"
      :onUpdateDepartment="onUpdateDepartment"
    />
  </div>
</template>

<script>
import departmentService from "../../api/department";
import resultService from "../../api/result"
import DepartmentCreatingDialog from "./DepartmentCreatingDialog.vue";
import DepartmentDialog from "./DepartmentDialog.vue";

const $ = window.$;
import roleUtil from "../../util/roleMapper";

export default {
  name: "DepartmentCard",
  data() {
    return {
      departments: [],
      result:[],
      headers: ["Tên bộ môn", "Quản lý"],
      selectedDepartment: null,
      roleUtil,
    };
  },
  beforeUnmount() {
    $("#departmentCreatingDialog").modal("hide");
    $("#departmentDialog").modal("hide");
  },

  methods: {
    onOpenCreatingDialog() {
      $("#departmentCreatingDialog").modal("show");
    },
    onOpenUpadtingDialog(department) {
      this.selectedDepartment = department;
      $("#departmentDialog").modal("show");
    },
    async onCreatingDepartment() {
      const departments = await departmentService.get({});
      this.departments = departments.data;
    },
    async onUpdateDepartment(idDepartment, idUser, title) {
      await departmentService.update({ idDepartment, owner: idUser, title });
      const departments = await departmentService.get({});
      this.departments = departments.data;
    },
  },

  async created() {
    const departments = await departmentService.get({});
    this.departments = departments.data;
    const result = await resultService.get({})
    this.result = result.data
  },
  components: { DepartmentCreatingDialog, DepartmentDialog },
};
</script>
