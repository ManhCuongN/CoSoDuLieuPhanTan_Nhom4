<template>
  <!-- Modal -->
  <div
    class="modal fade"
    id="topicModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    v-if="idSelectedTopic != null"
  >
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content" v-if="topic">
        <div class="modal-header">
          <h5 class="modal-title font-weight" id="exampleModalLabel">
            {{ topic.title }}
          </h5>
          <button
            type="button"
            class="btn-close text-dark"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body" v-if="topic">
          <div class="row">
            <div
              class="col-12 col-md-6 col-xl-8 mt-md-0 mt-4 position-relative"
              v-if="authData.isHavePermission([ROLE_TEACHER, ROLE_MANAGER])"
            >
              <input-new-topic
                :idTopic="idTopic"
                :title="title"
                :description="description"
                :filter="filter"
                :requiredSkills="requiredSkills"
                :numMembers="numMembers"
                :numRegisters="numRegisters"
                :numRequests="numRequests"
                @update:idTopic="idTopic = $event"
                @update:title="title = $event"
                @update:description="description = $event"
                @update:filter="filter = $event"
                @update:requiredSkills="requiredSkills = $event"
                @update:numMembers="numMembers = $event"
                @update:numRegisters="numRegisters = $event"
                @update:numRequests="numRequests = $event"
                @update:validForm="validForm = $event"
              />
            </div>

            <div
              v-else
              class="col-12 col-md-6 col-xl-8 mt-md-0 mt-4 position-relative"
            >
              <topic-details :topic="topic" />
              <hr class="my-1 horizontal dark" />

              <div>
                <strong class="text-danger text-sm"
                  >Ghi chú của trưởng khoa:</strong
                >
                <p class="text-sm pre-line">{{ deanNote }}</p>
              </div>
              <hr class="my-1 horizontal dark" />

              <div>
                <strong class="text-danger text-sm"
                  >Ghi chú của trưởng bộ môn:</strong
                >
                <p class="text-sm pre-line">{{ hdNote }}</p>
              </div>
            </div>

            <div class="col-12 col-md-6 col-xl-4 position-relative">
              <div class="card card-plain h-100">
                <div class="p-3 pb-0 card-header">
                  <h6 class="mb-0 text-info">{{ checkProgress }} !</h6>
                </div>
                <div v-if="authData.isHavePermission([ROLE_DEAN, ROLE_HD])">
                  <div class="p-3 pb-0 card-header">
                    <h6 class="mb-0">Ghi chú</h6>
                  </div>
                  <div class="ps-3">
                    <material-textarea
                      class="ps-0 ms-0"
                      name="titleNewTopic"
                      :rows="2"
                      label-class="mb-0 text-body text-truncate w-80"
                      :value="note"
                      placeholder="Nhập ghi chú"
                      @update:value="note = $event"
                      :success="validateNote"
                      :error="!validateNote"
                    >
                    </material-textarea>
                    <div class="text-end mt-2 p-0">
                      <button
                        type="button"
                        class="btn btn-slack btn-icon-only rounded-circle"
                        title="Gửi"
                        @click="updateNote"
                      >
                        <span class="btn-inner--icon"
                          ><i class="fab fa-telegram"></i
                        ></span>
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  v-if="authData.isHavePermission([ROLE_TEACHER, ROLE_MANAGER])"
                  class="ps-3 py-3"
                >
                  <div>
                    <strong class="text-danger text-sm"
                      >Ghi chú của trưởng khoa:</strong
                    >
                    <p class="text-sm pre-line">{{ deanNote }}</p>
                  </div>
                  <hr class="my-1 horizontal dark" />

                  <div>
                    <strong class="text-danger text-sm"
                      >Ghi chú của trưởng bộ môn:</strong
                    >
                    <p class="text-sm pre-line">{{ hdNote }}</p>
                  </div>
                </div>
                <div class="ps-3 pt-0 pb-0 card-header">
                  <h6 class="mb-0">Lịch sử thay đổi</h6>
                </div>
                <div class="p-3"><history-edit :events="events" /></div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn bg-gradient-secondary"
            data-bs-dismiss="modal"
          >
            Đóng
          </button>
          <button
            v-if="authData.isHavePermission([ROLE_TEACHER, ROLE_MANAGER])"
            :disabled="!validForm"
            class="btn bg-gradient-warning"
            @click="onUpdateTopic"
          >
            Cập nhật
          </button>
          <button
            v-if="authData.isHavePermission([ROLE_TEACHER, ROLE_MANAGER])"
            :disabled="!validForm"
            class="btn bg-gradient-danger"
            @click="onDeleteTopic"
          >
            Xóa
          </button>
          <button
            v-if="authData.isHavePermission([ROLE_DEAN, ROLE_HD])"
            :disabled="!validUpdatingStatus"
            class="btn bg-gradient-success"
            @click="updateStatus"
          >
            Duyệt
          </button>
          
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import InputNewTopic from "./InputNewTopic.vue";
import TopicDetails from "./TopicDetails.vue";
import HistoryEdit from "./HistoryEdit.vue";
import topicService from "../../api/topic";
import eventService from "../../api/event";
import {
  ROLE_DEAN,
  ROLE_HD,
  ROLE_TEACHER,
  ROLE_MANAGER,
} from "../../constant/roleConstant";
import MaterialTextarea from "../../components/MaterialTextarea.vue";
const $ = window.$;
export default {
  name: "topic-admin-dialog",
  inject: ["authData"],
  props: {
    idSelectedTopic: {
      type: String,
    },
  },
  data() {
    return {
      idTopic:"",
      topic: null,
      title: "",
      description: "",
      requiredSkills: "",
      filter: "",
      numMembers: null,
      numRegisters: null,
      numRequests: null,
      ready: false,
      confirm: false,
      validForm: false,
      ROLE_DEAN,
      ROLE_HD,
      ROLE_TEACHER,
      ROLE_MANAGER,
      events: [],
      hdNote: "",
      deanNote: "",
      note: "",
    };
  },
  computed: {
    checkProgress() {
      if (this.ready == true && this.confirm == true) {
        return "Đề tài đã được trưởng khoa duyệt";
      } else if (this.ready == true && this.confirm == false) {
        return "Đề tài đã được trưởng bộ môn duyệt";
      } else if (this.ready == false) {
        return "Đề tài chưa được trưởng bộ môn duyệt";
      }
      return "";
    },
    validUpdatingStatus() {
      if (this.authData.isHDRole()) {
        return this.ready == false;
      } else if (this.authData.isDeanRole()) {
        return this.ready == true && this.confirm == false;
      }
      return false;
    },
    validateNote() {
      return this.note.trim() != "";
    },
    switchValue: {
      get() {
        if (this.authData.isHDRole()) {
          return this.ready;
        } else if (this.authData.isDeanRole()) {
          return this.confirm;
        }
        return false;
      },
      set(value) {
        if (this.authData.isHDRole()) {
          this.ready = value;
        } else if (this.authData.isDeanRole()) {
          this.confirm = value;
        }
      },
    },
  },
  methods: {
    async updateStatus() {
      if (this.authData.isHavePermission([ROLE_DEAN, ROLE_HD])) {
        await topicService.updateStatus({
          _id: this.idSelectedTopic,
          status: true,
        });
        if (this.authData.isHDRole()) {
          this.ready = true;
        } else if (this.authData.isDeanRole()) {
          this.confirm = true;
        }
        this.$emit("update:topics", true);
        $("#topicModal").modal("hide");
      }
    },
    async updateNote() {
      if (this.validateNote == true) {
        await topicService.addNote({
          _id: this.idSelectedTopic,
          note: this.note,
        });
        if (this.authData.isHDRole()) {
          this.hdNote = this.note;
        } else if (this.authData.isDeanRole()) {
          this.deanNote = this.note;
        }
        this.note = "";
      }
    },
    async onUpdateTopic() {
      if (this.validForm == true) {
        await topicService.update({
          _id: this.idSelectedTopic,
          idTopic: this.idTopic,
          title: this.title,
          description: this.description,
          requiredSkills: this.requiredSkills,
          filter: this.filter,
          numMembers: this.numMembers,
          limit: this.numRegisters,
          numRequests: this.numRequests,
        });
        this.$emit("update:topics", true);
        $("#topicModal").modal("hide");
      }
    },
    async onDeleteTopic() {
      const idTopic = this.idSelectedTopic
      if (this.validForm == true) {
        await topicService.deleteTopic({
          idTopic
        });
        $("#topicModal").modal("hide");
      }
      
    },

    
    whoAction() {
      if (this.authData.isHDRole()) {
        return ` trưởng bộ môn `;
      } else if (this.authData.isDeanRole()) {
        return ` trưởng khoa `;
      }
    },
  },
  components: {
    InputNewTopic,
    HistoryEdit,
    TopicDetails,
    MaterialTextarea,
  },
  watch: {
    async idSelectedTopic() {
      const topic = await topicService.get({ _id: this.idSelectedTopic });
      const events = await eventService.get({ objectId: this.idSelectedTopic });
      this.events = events.data;
   
      
      this.topic = topic.data[0];
      this.idTopic = this.topic.code
      this.title = this.topic.title;
      this.description = this.topic.description;
      this.requiredSkills = this.topic.requiredSkills;
      this.filter = this.topic.filter._id;
      this.numMembers = this.topic.numMembers;
      this.numRegisters = this.topic.limit;
      this.numRequests = this.topic.numRequests;
      this.ready = this.topic.ready;
      this.confirm = this.topic.confirm;
      this.hdNote = this.topic.hdNote;
      this.deanNote = this.topic.deanNote;
    },
  },
};
</script>


<style scoped lang="scss">
#topicModal {
  z-index: 10000;
}
.pre-line {
  white-space: pre-line;
}
</style>