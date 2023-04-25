<template>
  <div
    class="modal fade"
    id="departmentCreatingDialog"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalMessageTitle"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title font-weight" id="exampleModalLabel">
            Tạo bộ môn mới
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
            class="btn bg-gradient-success"
            :disabled="!validateTitle"
            @click="onClick"
          >
            Tạo mới
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
const $ = window.$;

import MaterialInput from "../../components/MaterialInput.vue";
import departmentService from "../../api/department";
export default {
  name: "DepartmentCreatingDialog",
  props: {
    onCreatingDepartment: Function,
  },
  data() {
    return {
      title: "",
    };
  },

  computed: {
    validateTitle() {
      return this.title.trim() != "";
    },
  },
  methods: {
    async onClick() {
      await departmentService.create({ title: this.title });
      this.onCreatingDepartment();
      this.title = "";
      $("#departmentCreatingDialog").modal("hide");
    },
  },
  components: {
    MaterialInput,
  },
};
</script>