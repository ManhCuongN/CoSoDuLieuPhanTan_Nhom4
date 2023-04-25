<template>
  <div class="py-4 container-fluid">
    <div class="col-12 text-end">
      <material-button
        color="success"
        variant="gradient"
        @click="onOpenSubjectDialog"
      >
        <i class="fas fa-plus me-2"></i>
        Tạo đợt đăng ký
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
              :detail="`${checkCloseAndOpen(
                subject
              )}: <span class='text-success text-sm font-weight-bolder'>${checkCloseAndOpenTime(
                subject
              )}</span>`"
              :icon="{
                name: 'event_available',
                color: 'text-white',
                background: 'success',
              }"
              redirectUrl="Quản lý đợt đăng ký"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div>
    <schedule-dialog
      :subjects="subjectNotYetScheduled"
      :onCreateSchedule="onCreateSchedule"
    />
  </div>
</template>
<script>
import SubjectCard from "./components/SubjectCard.vue";
import subjectService from "../api/subject";
import MaterialButton from "../components/MaterialButton.vue";
import scheduleDialog from "./components/ScheduleDialog.vue";

const $ = window.$;
export default {
  name: "dashboard-default",

  data() {
    return {
      subjects: [],
      subjectNotYetScheduled: [],
    };
  },

  async created() {
    this.subjects = (await subjectService.get({ scheduled: true })).data;
    this.subjectNotYetScheduled = (
      await subjectService.get({ scheduled: false })
    ).data;
    $("#scheduleDialog").on("hide.bs.modal", async () => {
      this.subjects = (await subjectService.get({ scheduled: true })).data;
      this.subjectNotYetScheduled = (
        await subjectService.get({ scheduled: false })
      ).data;
    });
  },
  unMouted() {
    $("#scheduleDialog").modal("hide");
  },
  methods: {
    onOpenSubjectDialog() {
      $("#scheduleDialog").modal("show");
    },
    async onCreateSchedule(idSubject, emails, idUsers, from, to) {
      await subjectService.createSchedule({
        from: from,
        to: to,
        _id: idSubject,
        idUsers: idUsers,
        emails: emails,
      });
    },
    checkCloseStatus(value) {
      return value == true ? "Chưa mở" : "Đang mở";
    },
    checkCloseAndOpenTime(subject) {
      if (subject.closeStatus == true) {
        return this.calTime(new Date(), subject.from);
      } else {
        return this.calTime(new Date(), subject.to);
      }
    },
    checkCloseAndOpen(subject) {
      if (subject.closeStatus == true) {
        return "Mở sau";
      } else {
        return "Đóng sau";
      }
    },
    calTime(from, to) {
      let time = new Date(from).getTime();

      let temp = Math.abs(Math.floor((new Date(to).getTime() - time) / 1000));

      let tm = {};
      tm.day = Math.floor(temp / (24 * 60 * 60));
      temp = temp - tm.day * 24 * 60 * 60;
      tm.hours = Math.floor(temp / (60 * 60));
      temp = temp - tm.hours * 60 * 60;

      tm.minutes = Math.floor(temp / 60);
      temp = temp - tm.minutes * 60;
      tm.seconds = temp;

      if (tm.day >= 1) {
        return tm.day + " ngày";
      } else if (tm.hours >= 1) {
        return tm.hours + " giờ";
      } else if (tm.minutes > 0) {
        return tm.minutes + "phút" + " " + tm.seconds + " giây";
      } else {
        return "Chuẩn bị ";
      }
    },
  },

  components: {
    SubjectCard,
    MaterialButton,
    scheduleDialog,
  },
};
</script>
