<template>
  <div class="card">
    <div class="card-header pb-0 px-3 d-flex justify-content-between">
      <h6 class="mb-0">Danh sách đề tài</h6>
      <material-button
        v-if="authData.isHavePermission([ROLE_DEAN, ROLE_HD, ROLE_TEACHER])"
        color="success"
        variant="gradient"
        @click="onOpenCreatingTopicDialog"
      >
        <i class="fas fa-plus me-2"></i>
        Tạo đề tài mới
      </material-button>
      <material-button
        v-if="
          authData.isHavePermission([ROLE_HD, ROLE_DEAN]) &&
          selectedTopics.length != 0
        "
        color="success"
        variant="gradient"
        @click="onMultiApproved"
      >
        Duyệt
      </material-button>
    </div>

    <div class="card-body pt-4 p-3">
      <div
        class="form-check px-3"
        v-if="authData.isHavePermission([ROLE_HD, ROLE_DEAN])"
      >
        <input
          class="form-check-input custom-checkbox"
          type="checkbox"
          value=""
          id="fcustomCheck1"
          v-model="isSelectAll"
          :checked="false"
        />
        <label class="custom-control-label" for="customCheck1"
          >Chọn tất cả</label
        >
      </div>
      <ul class="list-group">
        <li
          class="list-group-item border-0 mb-2"
          v-for="topic in topics"
          :key="topic"
        >
          <div class="d-flex justify-content-start">
            <div
              class="form-check d-flex align-items-center ps-0 pe-1"
              v-if="authData.isHavePermission([ROLE_HD, ROLE_DEAN])"
            >
              <input
                :key="selectedTopics.length"
                :disabled="!checkValidCheckBox(topic)"
                class="form-check-input custom-checkbox"
                @change="onChangeCheckBox(topic._id)"
                type="checkbox"
                :checked="checkExistSelectedTopic(topic._id)"
              />
            </div>
            <div class="w-100">
              <div
                class="
                  d-flex
                  bg-gray-100
                  p-4
                  border-radius-lg
                  hover
                  position-relative
                "
                @click="onOpenTopicDialog(topic)"
              >
                <div class="d-flex flex-column">
                  <div class="d-flex justify-content-start">
                    <h6 class="mb-3 text-sm">{{ topic.title }}</h6>
                  </div>
                  <span class="mb-2 text-xs">
                    Mã đề tài:
                    <span class="text-dark font-weight-bold ms-sm-2">{{
                      topic.code
                    }}</span>
                  </span>
                  <span class="mb-2 text-xs">
                    Phân loại:
                    <span class="text-dark font-weight-bold ms-sm-2">
                      {{ topic.filter.title }}</span
                    >
                  </span>
                  <span class="mb-2 text-xs">
                    Số lượng thành viên:
                    <span class="text-dark ms-sm-2 font-weight-bold">{{
                      topic.numMembers
                    }}</span>
                  </span>
                  <span class="mb-2 text-xs" v-if="mapRequests[topic._id]">
                    Số lượng yêu đăng ký hiện tại:
                    <span class="text-dark ms-sm-2 font-weight-bold">{{
                      mapRequests[topic._id].length
                    }}</span>
                  </span>
                  <span class="mb-2 text-xs" v-if="mapRequests[topic._id]">
                    Số lượng yêu đăng ký thành công:
                    <span class="text-dark ms-sm-2 font-weight-bold"
                      >{{ topic.numRegisters }}/{{ topic.limit }}</span
                    >
                  </span>
                  <span class="text-xs">
                    Giảng viên hướng dẫn:
                    <span class="text-dark ms-sm-2 font-weight-bold">{{
                      topic.idTeacher.displayName
                    }}</span>
                  </span>
                  <span
                    class="
                      badge badge-sm
                      bg-gradient-info
                      mt-2
                      px-1
                      btn-list-request
                    "
                    v-if="authData.isTeacherRole()"
                    @click.stop="
                      mapEnableRequest[topic._id] = !mapEnableRequest[topic._id]
                    "
                    >Yêu cầu đăng ký</span
                  >
                </div>
                <!-- <div class="ms-auto text-end">
                  <span
                    class="badge badge-sm bg-gradient-success"
                    v-if="checkApproved(topic) == true"
                    >Đã duyệt</span
                  >
                  <span class="badge badge-sm bg-gradient-secondary" v-else
                    >Chưa được duyệt</span
                  >
                </div> -->
              </div>

              <ul
                class="list-group mt-2 ms-md-5 ms-3"
                v-if="mapEnableRequest[topic._id] == true"
              >
                <li
                  class="list-group-item hover border-0"
                  v-for="request in mapRequests[topic._id]"
                  :key="request"
                  @click="onOpenRequestDialog(request)"
                >
                  <div
                    class="
                      d-flex
                      flex-column
                      bg-gray-100
                      p-4
                      mb-2
                      border-radius-lg
                    "
                  >
                    <span class="mb-2 text-xs">
                      Môn học:
                      <span class="text-dark font-weight-bold ms-sm-2">{{
                        request.idSubject.title
                      }}</span>
                    </span>
                    <span class="mb-2 text-xs">
                      Nhóm:
                      <span class="text-dark font-weight-bold ms-sm-2">{{
                        request.idGroup.name
                      }}</span>
                    </span>
                    <span class="mb-2 text-xs">
                      Trạng thái:
                      <span
                        class="badge badge-sm"
                        :class="colorStatus(request.status)"
                        >{{ statusMapper.mapStatus(request.status) }}</span
                      >
                    </span>
                    <span class="text-xs">
                      Ngày gửi:
                      <span class="text-dark ms-sm-2 font-weight-bold">{{
                        dateFormat(request.createdAt)
                      }}</span>
                    </span>
                  </div>
                </li>
              </ul>
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
    />
    <creating-topic-dialog
      :idSubject="idSubject"
      @update:topics="updateTopics = $event"
    />
    <request-dialog
      :request="selectedRequest"
      :onUpdateStatus="onUpdateStatus"
    />
  </div>
</template>

<script>
import CreatingTopicDialog from "./CreatingTopicDialog.vue";
import TopicAdminDialog from "./TopicAdminDialog.vue";
import RequestDialog from "./RequestDialog.vue";
import requestService from "../../api/request";
import MaterialButton from "../../components/MaterialButton.vue";
import statusMapper from "../../util/statusMapper";
import topicService from "../../api/topic";
import moment from "moment";
import { ROLE_DEAN, ROLE_HD, ROLE_TEACHER } from "../../constant/roleConstant";
import { STATUS_APPROVED, STATUS_SENDING } from "../../constant/statusConstant";

const $ = window.$;
export default {
  name: "list-topic-admin",
  inject: ["authData"],
  props: {
    topics: {
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
      mapRequests: {},
      mapEnableRequest: {},
      statusMapper,
      selectedRequest: null,
      selectedTopics: [],
      isSelectAll: false,
      ROLE_DEAN,
      ROLE_HD,
      ROLE_TEACHER,
    };
  },

  watch: {
    isSelectAll(value) {
      if (value == false) {
        this.selectedTopics = [];
      } else {
        this.onSelectAll();
      }
    },
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
        this.$emit("update:topics", value);
      },
    },
  },
  beforeUnmount() {
    $("#topicModal").modal("hide");
    $("#creatingTopicDialog").modal("hide");
    $("#requestModal").modal("hide");
  },
  methods: {
    onSelectAll() {
      this.selectedTopics = this.topics
        .filter((ele) => {
          return this.checkValidCheckBox(ele);
        })
        .map((data) => data._id);
    },
    async onMultiApproved() {
      if (this.selectedTopics.length != 0) {
        for (let i = 0; i < this.selectedTopics.length; i++) {
          await topicService.updateStatus({
            _id: this.selectedTopics[i],
            status: true,
          });
        }
        this.selectedTopics = [];
        this.$emit("update:topics", true);
      }
    },
    checkExistSelectedTopic(idTopic) {
      const index = this.selectedTopics.indexOf(idTopic);
      return index == -1 ? false : true;
    },
    onChangeCheckBox(idTopic) {
      const index = this.selectedTopics.indexOf(idTopic);
      if (index == -1) {
        this.selectedTopics.push(idTopic);
      } else {
        this.selectedTopics.splice(index, 1);
      }
    },
    checkValidCheckBox(topic) {
      if (this.authData.isHDRole()) {
        return topic.ready == false;
      } else if (this.authData.isDeanRole()) {
        return topic.ready == true && topic.confirm == false;
      }
      return false;
    },
    colorStatus(status) {
      if (status == STATUS_SENDING) {
        return "bg-gradient-info";
      } else if (status == STATUS_APPROVED) {
        return "bg-gradient-success";
      } else {
        return "bg-gradient-danger";
      }
    },
    onOpenTopicDialog(topic) {
      this.idSelectedTopic = topic._id;
      $("#topicModal").modal("show");
    },
    onOpenCreatingTopicDialog() {
      $("#creatingTopicDialog").modal("show");
    },
    onOpenRequestDialog(request) {
      this.selectedRequest = request;
      $("#requestModal").modal("show");
    },
    async getRequestsTopic(idTopic) {
      const requests = await requestService.get({ idTopic: idTopic });
      return requests.data;
    },
    dateFormat(value) {
      return moment(value).format("DD/MM/YYYY hh:mm:ss");
    },
    async onUpdateStatus() {
      this.$emit("update:topics", true);
    },
    checkApproved(topic) {
      if (this.authData.isHDRole()) {
        return topic.ready == true;
      } else if (this.authData.isDeanRole()) {
        return topic.confirm == true;
      } else if (
        this.authData.isTeacherRole() ||
        this.authData.isManagerRole()
      ) {
        return topic.ready == true && topic.confirm == true;
      }
    },
  },
  components: {
    CreatingTopicDialog,
    MaterialButton,
    TopicAdminDialog,
    RequestDialog,
  },
};
</script>


<style  scoped lang="scss">
.btn-list-request {
  width: 12.5vmax !important;
  max-width: 12.5vmax;
}
.custom-checkbox {
  border: 1px solid red !important;
}

.custom-checkbox:disabled {
  cursor: not-allowed !important;
}
.form-check-input:disabled {
  pointer-events: all !important;
  filter: none !important;
  opacity: 0.5 !important;
}
</style>


