<template>
  <div class="card h-100 mb-4">
    <div class="card-header pb-0 px-3">
      <h6 class="mb-0">Thông tin</h6>
    </div>
    <div class="card-body p-3">
      <div class="d-flex justify-content-between">
        <schedule-infor-card
          :numTopics="topics.length"
          :numRequests="requests.length"
        />
        <div>
          <ul class="list-group">
            <li class="pt-0 text-sm border-0 list-group-item ps-0">
              <strong class="text-dark">Ngày bắt đầu:</strong> &nbsp;
              {{ dateFormat(subject.from) }}
            </li>
            <li class="text-sm border-0 list-group-item ps-0">
              <strong class="text-dark">Ngày kết thúc:</strong> &nbsp;
              {{ dateFormat(subject.to) }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ScheduleInforCard from "./ScheduleInforCard.vue";
import topicService from "../../api/topic";
import requestService from "../../api/request";
import moment from "moment";
export default {
  name: "schedule-information",
  props: {
    subject: Object,
  },
  data() {
    return {
      topics: [],
      requests: [],
    };
  },
  components: {
    ScheduleInforCard,
  },

  watch: {
    async subject() {
      if (this.subject) {
        const idSubject = this.subject._id;
        const topics = await topicService.get({
          idSubject,
          ready: true,
          confirm: true,
        });
        this.topics = topics.data;
        const requests = await requestService.get({ idSubject });
        this.requests = requests.data;
      }
    },
  },
  methods: {
    dateFormat(value) {
      return moment(value).format("MM/DD/YYYY");
    },
  },
};
</script>