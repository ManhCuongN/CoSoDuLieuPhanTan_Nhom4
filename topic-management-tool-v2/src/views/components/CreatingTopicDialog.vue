<template>
  <!-- Modal -->
  <div
    class="modal fade"
    id="creatingTopicDialog"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title font-weight" id="exampleModalLabel">
            Tạo mới đề tài
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
          <div class="position-relative mt-md-0 mt-4">
            <input-new-topic
              :title="title"
              :description="description"
              :filter="filter"
              :requiredSkills="requiredSkills"
              :numMembers="numMembers"
              :numRegisters="numRegisters"
              :numRequests="numRequests"
              @update:title="title = $event"
              @update:description="description = $event"
              @update:filter="filter = $event"
              @update:requiredSkills="requiredSkills = $event"
              @update:numMembers="numMembers = $event"
              @update:numRegisters="numRegisters = $event"
              @update:numRequests="numRequests = $event"
              @update:validForm="validForm = $event"
            />

            <div class="input-group input-group-outline d-block px-3 pe-4">
              <label for="selectDepartment" class="ms-0"
                >Chọn nhóm đăng ký sẵn (nếu có):
              </label>

              <select class="form-control w-100" v-model="idGroup">
                <option
                  :selected="idGroup == group._id"
                  :key="group"
                  v-for="group in groups"
                  :value="group._id"
                >
                  {{ group.name }}
                </option>
              </select>
            </div>
            <div v-if="selectedGroup != null" class="px-3 pe-4">
              <router-link
                :to="{
                  name: 'Thông tin cá nhân',
                  params: { idUser: user._id },
                }"
                v-for="user in selectedGroup.idUsers"
                :key="user"
                class="mx-1 py-1"
                ><span class="badge bg-gradient-success">{{
                  user.displayName
                }}</span></router-link
              >
            </div>

            <hr class="vertical dark" />
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn bg-gradient-secondary"
            data-bs-dismiss="modal"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            class="btn bg-gradient-success"
            @click="onCreatingTopic"
            :disabled="!validForm"
          >
            Tạo đề tài
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import InputNewTopic from "./InputNewTopic.vue";
import topicService from "../../api/topic";
import groupService from "../../api/group";
import subjectService from "../../api/subject";
const $ = window.$;

export default {
  name: "creating-topic-dialog",
  data() {
    return {
      title: "",
      description: "",
      requiredSkills: "",
      filter: "",
      numMembers: null,
      numRegisters: null,
      numRequests: null,
      validForm: false,
      listStudentsInSubject: [],
      idGroup: "",
      groups: [],
      selectedGroup: [],
    };
  },

  props: {
    idSubject: {
      type: String,
      required: true,
    },
  },
  async created() {
    const listStudentsInSubject = await subjectService.get({
      _id: this.idSubject,
    });
    this.listStudentsInSubject = listStudentsInSubject.data[0];
  },
  watch: {
    idGroup() {
      this.selectedGroup = null;
      if (this.idGroup != "") {
        for (let i = 0; i < this.groups.length; i++) {
          if (this.groups[i]._id == this.idGroup) {
            this.selectedGroup = this.groups[i];
            break;
          }
        }
      }
    },
    async numMembers() {
      this.idGroup = "";
      if (this.numMembers > 0) {
        const query = {};
        query["idUsers." + this.numMembers] = { $exists: false };

        const groups = await groupService.get(query);
        this.groups = groups.data;
        const membersSubject = this.listStudentsInSubject.students;
        this.groups = this.groups.filter((ele) => {
          ele.idUsers.forEach((user) => {
            if (membersSubject.indexOf(user._id) == -1) {
              return false;
            }
          });
          return true;
        });
        console.log(this.groups);
      }
    },
  },
  components: {
    InputNewTopic,
  },
  methods: {
    async onCreatingTopic() {
      await topicService.create({
        title: this.title,
        description: this.description,
        requiredSkills: this.requiredSkills,
        filter: this.filter,
        numMembers: this.numMembers,
        limit: this.numRegisters,
        numRequests: this.numRequests,
        idSubject: this.idSubject,
        idGroup: this.idGroup,
      });
      this.$emit("update:topics", true);
      this.title = "";
      this.description = "";
      this.requiredSkills = "";
      this.filter = "";
      this.numMembers = null;
      this.numRegisters = null;
      this.numRequests = null;
      this.validForm = false;
      this.idGroup = "";
      $("#creatingTopicDialog").modal("hide");
    },
  },
};
</script>


<style scoped lang="scss">
#creatingTopicDialog {
  z-index: 10000;
}
</style>