<template>
  <div class="py-4 container-fluid">
    <div class="col-12 text-end" v-if="authData.isManagerRole() == true">
      <material-button
        color="success"
        variant="gradient"
        @click="onOpenSubjectDialog"
      >
        <i class="fas fa-plus me-2"></i>
        Tạo môn học mới
      </material-button>
    </div>
    <div class="row my-4">
      <div class="col-lg-12 position-relative z-index-2">
        <div class="row">
          <div
            class="col-lg-3 col-md-6 col-sm-6"
            v-for="subject in subjects"
            :key="subject"
          >
            <subject-card
              :name="subject.title"
              :id="subject._id"
              :title="{
                text: checkCloseStatus(subject.closeStatus),
                value: subject.title,
              }"
              :detail="`Số đề tài được đăng ký: <span class='text-success text-sm font-weight-bolder'>${subject.limitRequest}</span>`"
              :icon="{
                name: 'auto_stories',
                color: 'text-white',
                background: 'dark',
              }"
              redirectUrl="Quản lý đề tài"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div>
    <subject-dialog @update:schedules="onUpdateSchedule" />
  </div>
</template>
<script>
import SubjectCard from "./components/SubjectCard.vue";
import subjectService from "../api/subject";
import MaterialButton from "../components/MaterialButton.vue";
import SubjectDialog from "./components/SubjectDialog.vue";

const $ = window.$;
export default {
  name: "dashboard-default",
  inject: ["authData"],
  data() {
    return {
      subjects: [],
    };
  },

  async created() {
    this.subjects = (await subjectService.get({})).data;
  },
  methods: {
    async onUpdateSchedule() {
      this.subjects = (await subjectService.get({})).data;
    },
    onOpenSubjectDialog() {
      $("#subjectDialog").modal("show");
    },
    checkCloseStatus(value) {
      return value == true ? "Chưa mở" : "Đang mở";
    },
  },
  beforeUnmount() {
    $("#subjectDialog").modal("hide");
  },
  components: {
    SubjectCard,
    MaterialButton,
    SubjectDialog,
  },
};
</script>
