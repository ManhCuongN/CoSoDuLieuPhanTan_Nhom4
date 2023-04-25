<template>
  <div
    class="modal fade"
    id="subjectDialog"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalMessageTitle"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title font-weight" id="exampleModalLabel">
            Tạo mới môn học
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
          <form>
            <material-textarea
              placeholder="Tên môn học"
              class="ps-0 ms-0"
              :success="validateTitle"
              :error="!validateTitle"
              :isRequired="true"
              :value="title"
              @update:value="title = $event"
            />
            <material-input
              :value="numRequests"
              :success="validateNumRequests"
              :error="!validateNumRequests"
              :isRequired="true"
              @update:value="numRequests = $event"
              type="number"
              label="Số đề tài tối đa 1 nhóm được đăng ký"
              class="my-2"
            />
          </form>
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
            :disabled="!validateTitle || !validateNumRequests"
            @click="onCreateSubject"
          >
            Tạo mới
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialTextarea from "../../components/MaterialTextarea.vue";
import subjectService from "../../api/subject";

const $ = window.$;
export default {
  name: "subject-dialog",
  components: {
    MaterialInput,
    MaterialTextarea,
  },
  data() {
    return {
      title: "",
      numRequests: null,
    };
  },

  computed: {
    validateNumRequests() {
      return this.numRequests && Number(this.numRequests) >= 1;
    },
    validateTitle() {
      return this.title.trim() != "";
    },
  },
  methods: {
    async onCreateSubject() {
      if (this.validateNumRequests && this.validateTitle) {
        await subjectService.create({
          title: this.title,
          limitRequest: this.numRequests,
        });
        this.title = "";
        this.numRequests = null;
        this.$emit("update:schedules", true);
        $("#subjectDialog").modal("hide");
      }
    },
  },
};
</script>