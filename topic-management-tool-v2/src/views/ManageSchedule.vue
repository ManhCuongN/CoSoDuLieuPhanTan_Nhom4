<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-md-8 col-12 mb-md-0 mb-3">
        <schedule-information :subject="subject" />
      </div>
      <div class="col-md-4 col-12">
        <list-student
          :students="students"
          :totalInvitation="subject.totalInvitation"
          :idSubject="idSubject"
          @update:students="onUpdateStudents()"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ListStudent from "./components/ListStudent.vue";
import ScheduleInformation from "./components/ScheduleInformation.vue";
import subjectService from "../api/subject";
export default {
  name: "manage-schedule",
  data() {
    return {
      subject: {},
      idSubject: "",
      students: [],
    };
  },
  components: { ListStudent, ScheduleInformation },
  beforeCreate() {
    const { idSubject } = this.$route.params;
    if (idSubject == null) {
      this.$router.back();
    }
  },

  async created() {
    const { idSubject } = this.$route.params;
    this.idSubject = idSubject;
    const subject = await subjectService.get({ _id: idSubject });
    this.subject = subject.data[0];
    this.students = this.subject.students;
  },
  methods: {
    async onUpdateStudents() {
      const subject = await subjectService.get({ _id: this.idSubject });
      this.subject = subject.data[0];
      this.students = this.subject.students;
    },
  },
};
</script>
