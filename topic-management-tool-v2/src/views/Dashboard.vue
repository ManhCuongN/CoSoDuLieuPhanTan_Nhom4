<template>
  <div class="py-4 container-fluid">
    <div class="row mb-4">
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
                text: `${checkCloseAndOpen(subject)}: ${checkCloseAndOpenTime(
                  subject
                )}`,
                value: subject.title,
              }"
              :detail="`Số đề tài được đăng ký: <span class='text-success text-sm font-weight-bolder'>${subject.limitRequest}</span>`"
              :icon="{
                name: 'auto_stories',
                color: 'text-white',
                background: 'dark',
              }"
              redirectUrl="Đăng ký đề tài"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SubjectCard from "./components/SubjectCard.vue";
import subjectService from "../api/subject";
import authData from "../data/authData";
export default {
  name: "dashboard-default",
  inject: ["authData"],
  data() {
    return {
      subjects: [],
    };
  },
  async created() {
    const idUser = authData.state.user._id;
    this.subjects = (
      await subjectService.get({
        students: idUser,
        scheduled: true,
        closeStatus: false,
      })
    ).data;
  },

  methods: {
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
  },
};
</script>
