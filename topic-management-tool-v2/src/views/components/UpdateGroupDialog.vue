<template>
  <div>
    <div
      class="modal fade"
      id="updateGroupDialog"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modal-form"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content" v-if="group">
          <div class="modal-body p-0">
            <div class="card card-plain">
              <div class="card-header pb-0 text-left">
                <h5 class="">Đổi tên nhóm</h5>
              </div>
              <div class="card-body">
                <div class="input-group input-group-outline mb-3">
                  <material-input
                    type="text"
                    size="lg"
                    label="Nhập tên mới của nhóm"
                    :value="newName"
                    @update:value="newName = $event"
                    :success="validateName"
                    :error="!validateName"
                  />
                </div>

                <div class="text-center">
                  <button
                    type="button"
                    :disabled="!validateName"
                    @click="onUpdateGroup"
                    class="
                      btn btn-round
                      bg-gradient-warning
                      btn-lg
                      w-100
                      mt-4
                      mb-0
                    "
                  >
                    Cập nhật
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import groupService from "../../api/group";
import MaterialInput from "../../components/MaterialInput.vue";

const $ = window.$;
export default {
  name: "UpdateGroupDialog",
  data() {
    return {
      newName: "",
    };
  },
  props: {
    group: Object,
    onClickUpdateGroup: Function,
  },
  watch: {
    async group() {
      this.newName = this.group.name;
    },
  },
  computed: {
    validateName() {
      return this.newName.trim() != "";
    },
  },
  methods: {
    async onUpdateGroup() {
      await groupService.update({ _id: this.group._id, newName: this.newName });
      this.onClickUpdateGroup();
      $("#updateGroupDialog").modal("hide");
    },
  },
  components: {
    MaterialInput,
  },
};
</script>

