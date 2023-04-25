<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <list-request-card :requests="requests"></list-request-card>
        <list-proposal-card :proposals="proposals"></list-proposal-card>
      </div>
    </div>
  </div>
</template>

<script>
import ListRequestCard from "./components/ListRequestCard.vue";
import ListProposalCard from "./components/ListProposalCard.vue";
import requestService from "../api/request";
import proposalService from "../api/proposal";
export default {
  name: "request",
  data() {
    return {
      requests: [],
      proposals: [],
    };
  },

  async created() {
    const requests = await requestService.get({});
    const proposals = await proposalService.get({});
    this.requests = requests.data;
    this.proposals = proposals.data;
  },
  components: {
    ListRequestCard,
    ListProposalCard,
  },
};
</script>
