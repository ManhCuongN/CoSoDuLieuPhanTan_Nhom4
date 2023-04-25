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
        <div class="modal-body">
          <div class="row">
            <div
              class="col-12 col-md-6 col-xl-8 mt-md-0 mt-4 position-relative"
            >
              <topic-details :topic="topic" />
              <hr class="vertical dark" v-if="isEnrolled == false" />
            </div>

            <div
              class="col-12 col-md-6 col-xl-4 position-relative"
              v-if="isEnrolled == false"
            >
              <div class="card card-plain h-100">
                <div class="p-3 pb-0 card-header">
                  <h6 class="mb-0">Nhập thông tin đăng ký</h6>
                </div>
                <div class="p-3 card-body">
                  <h6
                    class="text-xs text-uppercase text-body font-weight-bolder"
                  >
                    Chọn nhóm và lập kế hoạch cho đề tài.
                  </h6>
                  <ul class="list-group">
                    <li class="px-0 border-0 list-group-item">
                      <div
                        class="input-group input-group-outline d-block mb-4"
                        :class="
                          validateGroup == true ? 'is-valid' : 'is-invalid'
                        "
                      >
                        <label for="exampleFormControlSelect1" class="ms-0"
                          >Nhóm:</label
                        >

                        <select
                          class="form-control w-100"
                          id="exampleFormControlSelect1"
                          v-model="selectedGroup"
                        >
                          <option
                            v-for="group in groups"
                            :key="group"
                            :value="group._id"
                            :selected="selectedGroup"
                          >
                            {{ group.name }}
                          </option>
                        </select>
                      </div>
                    </li>
                    <li class="px-0 border-0 list-group-item">
                      <div class="input-group input-group-static mb-4">
                        <label for="flexSwitchCheckDefault1" class="ms-0"
                          >Kế hoạch:</label
                        >
                        <material-textarea
                          class="ps-0 ms-0"
                          name="flexSwitchCheckDefault1"
                          label-class="mb-0 text-body text-truncate w-80"
                          :value="plan"
                          @update:value="plan = $event"
                          placeholder="Nhập kế hoạch cho đề tài đăng ký hoặc có thế đính kém link docs"
                          :success="validatePlan"
                          :error="!validatePlan"
                        >
                        </material-textarea>
                      </div>
                    </li>
                  </ul>
                </div>
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
            v-if="isEnrolled == false"
            type="button"
            class="btn bg-gradient-primary"
            :disabled="!validateGroup || !validatePlan"
            @click="onClickButton"
          >
            Đăng ký đề tài
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import TopicDetails from "./TopicDetails.vue";
import MaterialTextarea from "../../components/MaterialTextarea.vue";
import topicService from "../../api/topic";
import groupService from "../../api/group";
export default {
  name: "topic-dialog",
  props: {
    idSelectedTopic: {
      type: String,
    },
    onRegisterTopic: Function,
    isEnrolled: Boolean,
  },
  data() {
    return {
      topic: null,
      selectedGroup: "",
      groups: [],
      plan: "",
    };
  },

  computed: {
    validatePlan() {
      return this.plan.trim() != "";
    },
    validateGroup() {
      return this.selectedGroup.trim() != "";
    },
  },
  methods: {
    onClickButton() {
      if (this.validateGroup && this.validatePlan) {
        this.onRegisterTopic(this.selectedGroup, this.plan);
        this.selectedGroup = "";
        this.plan = "";
      }
    },
  },
  components: {
    TopicDetails,
    MaterialTextarea,
  },
  watch: {
    async idSelectedTopic() {
      const topic = await topicService.get({ _id: this.idSelectedTopic });
      this.topic = topic.data[0];

      if (this.isEnrolled == false) {
        const query = {};
        query["idUsers." + this.topic.numMembers] = { $exists: false };

        const groups = await groupService.get(query);
        this.groups = groups.data;
        const membersSubject = this.topic.idSubject.students;
        this.groups.filter((ele) => {
          ele.idUsers.forEach((user) => {
            if (membersSubject.indexOf(user._id) == -1) {
              return false;
            }
          });
          return true;
        });
      }
    },
  },
};
</script>


<style scoped lang="scss">
#topicModal {
  z-index: 10000;
}
</style>