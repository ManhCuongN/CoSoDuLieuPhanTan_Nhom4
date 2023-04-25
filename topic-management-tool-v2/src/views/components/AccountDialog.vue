<template>
  <div
    class="modal fade"
    id="accountDialog"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalMessageTitle"
    aria-hidden="true"
    v-if="user"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title font-weight" id="exampleModalLabel">
            {{ user.displayName }}
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
          <div>
            <label for="exampleFormControlSelect2" class="ms-0"
              >Chọn vai trò</label
            >

            <select class="d-block w-100" id="select-role" v-model="role">
              <option
                :value="role"
                v-for="role in roleUtil.get()"
                :key="role"
                :selected="role == user.role"
              >
                {{ roleUtil.mapRole(role) }}
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
            :disabled="role == user.role"
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
import roleUtil from "../../util/roleMapper";
const $ = window.$;

export default {
  name: "AccountDialog",
  components: {},
  data() {
    return {
      roleUtil,
      role: "",
    };
  },
  props: {
    user: Object,
    onUpdateRole: Function,
  },
  watch: {
    user() {
      this.role = this.user.role;
    },
  },
  methods: {
    onClick() {
      this.onUpdateRole(this.user._id, this.role);
      this.role = "";
      $("#accountDialog").modal("hide");
    },
  },
};
</script>