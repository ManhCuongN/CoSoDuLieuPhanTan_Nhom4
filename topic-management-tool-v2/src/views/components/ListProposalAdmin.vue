<template>
  <div class="card">
    <div class="card-header pb-0 px-3 d-flex justify-content-between">
      <h6 class="mb-0">Danh sách đề xuất đề tài</h6>
    </div>

    <div class="card-body pt-4 p-3">
      <ul class="list-group">
        <li
          class="list-group-item border-0 mb-2"
          v-for="proposal in proposals"
          :key="proposal"
          @click="onOpenProposalDialog(proposal)"
        >
          <div class="d-flex bg-gray-100 p-4 border-radius-lg hover">
            <div class="d-flex flex-column">
              <h6 class="mb-3 text-sm">{{ proposal.title }}</h6>
              <span class="mb-2 text-xs">
                Nhóm:
                <span class="text-dark font-weight-bold ms-sm-2">{{
                  proposal.idGroup.name
                }}</span>
              </span>
              <span class="mb-2 text-xs">
                Phân loại:
                <span class="text-dark font-weight-bold ms-sm-2">
                  {{ proposal.filter.title }}</span
                >
              </span>
              <span class="mb-2 text-xs">
                Giảng viên mong muốn:
                <span class="text-dark ms-sm-2 font-weight-bold">{{
                  proposal.idTeacher.displayName
                }}</span>
              </span>
              <span class="mb-2 text-xs">
                Ngày tạo:
                <span class="text-dark ms-sm-2 font-weight-bold">{{
                  dateFormat(proposal.createdAt)
                }}</span>
              </span>
            </div>
            <div class="ms-auto text-end">
              <span
                class="badge badge-sm bg-gradient-danger"
                v-if="proposal.status == STATUS_REJECTED"
                >Không được duyệt</span
              >
              <span
                class="badge badge-sm bg-gradient-success"
                v-else-if="checkApproved(proposal)"
                >Đã duyệt</span
              >
              <span class="badge badge-sm bg-gradient-secondary" v-else
                >Chưa được duyệt</span
              >
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div>
    <topic-admin-dialog
      :idSelectedTopic="idSelectedTopic"
      @update:topics="updateTopics = $event"
    /><proposal-admin-dialog
      :idSelectedProposal="idSelectedProposal"
      @update:proposals="updateProposals()"
    />
  </div>
</template>

<script>
import TopicAdminDialog from "./TopicAdminDialog.vue";
import ProposalAdminDialog from "./ProposalAdminDialog.vue";
import requestService from "../../api/request";
import statusMapper from "../../util/statusMapper";
import moment from "moment";
import { STATUS_REJECTED } from "../../constant/statusConstant";

const $ = window.$;
export default {
  name: "list-proposal-admin",
  inject: ["authData"],
  props: {
    proposals: {
      type: Array,
      required: true,
    },
    idSubject: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      idSelectedTopic: "",
      idSelectedProposal: "",
      mapRequests: {},
      mapEnableRequest: {},
      statusMapper,
      selectedRequest: null,
      STATUS_REJECTED,
    };
  },

  watch: {
    async topics() {
      this.topics.forEach(async (ele) => {
        this.mapEnableRequest[ele._id] = false;
        this.mapRequests[ele._id] = await this.getRequestsTopic(ele._id);
      });
    },
  },
  computed: {
    updateTopics: {
      get() {
        return false;
      },
      set(value) {
        this.$emit("update:proposals", value);
      },
    },
  },
  beforeUnmount() {
    $("#topicModal").modal("hide");
    $("#ProposalAdminModal").modal("hide");
  },
  methods: {
    onOpenTopicDialog(topic) {
      this.idSelectedTopic = topic._id;
      $("#topicModal").modal("show");
    },
    onOpenProposalDialog(proposal) {
      this.idSelectedProposal = proposal._id;
      $("#ProposalAdminModal").modal("show");
    },
    async getRequestsTopic(idTopic) {
      const requests = await requestService.get({ idTopic: idTopic });
      return requests.data;
    },
    updateProposals() {
      this.idSelectedProposal = "";
      this.$emit("update:proposals", true);
    },
    dateFormat(value) {
      return moment(value).format("DD/MM/YYYY hh:mm:ss");
    },
    async onUpdateStatus() {
      this.idSelectedTopic = "";
      this.$emit("update:topics", true);
    },
    checkApproved(proposal) {
      if (this.authData.isHDRole()) {
        return proposal.ready == true;
      } else if (this.authData.isDeanRole()) {
        return proposal.confirm == true;
      }
    },
  },
  components: {
    TopicAdminDialog,
    ProposalAdminDialog,
  },
};
</script>


