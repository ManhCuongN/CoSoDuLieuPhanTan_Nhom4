<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <list-topic-card
          :topics="topics"
          @update:topics="updateTopics"
          :maxRequest="maxRequest"
          :idSubject="idSubject"
        >âs
      </list-topic-card>
       
      </div>

    </div>
  </div>
</template>

<script>
import ListTopicCard from "./components/ListTopicCard.vue";
import topicService from "../api/topic";
import subjectService from "../api/subject";
export default {
  name: "register",
  data() {
    return {
      idTopic: "",
      topics: [],
      maxRequest: 0,
      idSubject: "",
    };
  },

  components: {
    ListTopicCard,
  },
  methods: {
    async updateTopics() {
      const topics = await topicService.get({
        idSubject: this.idSubject,
        confirm: true,
      });
      this.topics = topics.data;
    },
  },
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
    this.maxRequest = subject.data[0].limitRequest;

    const topics = await topicService.get({
      idSubject: idSubject,
      confirm: true,
    });
    this.topics = topics.data;
  },
};
</script>
