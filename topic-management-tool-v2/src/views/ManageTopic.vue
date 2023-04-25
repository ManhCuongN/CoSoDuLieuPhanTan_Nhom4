<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div
        class="col-12"
        :class="{ 'col-md-9 order-md-1 order-2': authData.isManagerRole() }"
      >
        <list-topic-admin
          :topics="topics"
          @update:topics="updateTopics($event)"
          :idSubject="idSubject"
        ></list-topic-admin>
      </div>
      <div
        class="col-12 col-md-3 order-md-2 order-1"
        v-if="authData.isManagerRole()"
      >
        <subject-action
          :idSubject="idSubject"
          @update:topics="updateTopics($event)"
        />
      </div>
    </div>
  </div>
  <div
    class="container-fluid py-4"
    v-if="authData.isHDRole() || authData.isDeanRole()"
  >
    <list-proposal-admin
      :proposals="proposals"
      @update:proposals="updateProposals($event)"
      :idSubject="idSubject"
    ></list-proposal-admin>
  </div>
</template>

<script>
import ListTopicAdmin from "./components/ListTopicAdmin.vue";
import ListProposalAdmin from "./components/ListProposalAdmin.vue";
import topicService from "../api/topic";
import proposalService from "../api/proposal";
import SubjectAction from "./components/SubjectAction.vue";
export default {
  name: "manage-topic",
  inject: ["authData"],
  data() {
    return {
      idTopic: "",
      topics: [],
      idSubject: "",
      proposals: [],
    };
  },
  components: {
    ListTopicAdmin,
    ListProposalAdmin,
    SubjectAction,
  },

  beforeCreate() {
    const { idSubject } = this.$route.params;

    if (idSubject == null || idSubject == "") {
      console.log(idSubject);
      this.$router.push({ name: "Quản lý môn học" });
    }
  },
  async created() {
    const { idSubject } = this.$route.params;
    this.idSubject = idSubject;
    const topics = await topicService.get({ idSubject: this.idSubject });
    this.topics = topics.data;
    if (this.authData.isHDRole() || this.authData.isDeanRole()) {
      const proposals = await proposalService.get({
        idSubject: this.idSubject,
      });
      this.proposals = proposals.data;
    }
  },
  methods: {
    async updateTopics(value) {
      if (value == true) {
        const topics = await topicService.get({ idSubject: this.idSubject });
        this.topics = topics.data;
      }
    },
    async updateProposals(value) {
      if (value == true) {
        const proposals = await proposalService.get({
          idSubject: this.idSubject,
        });
        this.proposals = proposals.data;
      }
    },
  },
};
</script>
