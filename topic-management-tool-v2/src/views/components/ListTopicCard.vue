<template>
  <div class="card">
    <div class="card-header pb-0 px-3 d-flex justify-content-between">
      <h6 class="mb-0">Danh sách đề tài</h6>
      {{ authData }}
      <material-button
        color="success"
        variant="gradient"
        @click="onOpenCreatingProposalDialog"
      >
        <i class="fas fa-plus me-2"></i>
        Đề xuất đề tài mới
      </material-button>
    </div>

    <div class="card-body pt-4 p-3">
      <ul class="list-group">
        <li
          class="
            list-group-item
            border-0
            d-flex
            p-4
            mb-2
            bg-gray-100
            border-radius-lg
            hover
          "
          @click="onOpenTopicDialog(topic)"
          v-for="topic in topics"
          :key="topic"
        >
        
          <div class="d-flex flex-column">
            <h6 class="mb-3 text-sm">{{ topic.title }}</h6>
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
            <span class="text-xs">
              Giảng viên hướng dẫn:
              <span class="text-dark ms-sm-2 font-weight-bold">{{
                topic.idTeacher.displayName
              }}</span>
            </span>
          </div>
          <div class="ms-auto text-end">
            <li class="mt-0 pb-0 mb-3 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Tải lên danh sách đề tài:</strong>
          &nbsp;<i
            class="fas fa-upload hover text-lg"
            @click="onOpenInputFile"
          ></i>
        </li>
        <span
              class="badge badge-sm bg-gradient-primary"
              >Chưa duyệt</span
            >
            <br>

            <span
              class="badge badge-sm bg-gradient-secondary"
              v-if="requests.length >= maxRequest"
              >Đã đăng ký tối đa</span
            >
            <span
              class="badge badge-sm bg-gradient-primary"
              v-else-if="checkRegister(topic._id) != -1"
              >Đã đăng ksý</span
            >
          
         
          
            <span
              class="badge badge-sm bg-gradient-success"
              v-else-if="Number(topic.numRegisters) < Number(topic.limit)"
              >Có thể đăng ký</span
            >
            <span class="badge badge-sm bg-gradient-secondary" v-else
              >Hết lượt đăng ký</span
            >
            
          </div>
          <!-- <a :href="urlReport" download>Download File</a> -->
        </li>
        
      </ul>
      <div class="text-primary text-gradient font-weight-bold text-end">
        {{ requests.length }}/ {{ maxRequest }} lượt đăng ký
      </div>
    </div>
  </div>
  <div>
    <topic-dialog
      :idSelectedTopic="idSelectedTopic"
      :onRegisterTopic="onRegisterTopic"
      :isEnrolled="checkRegister(idSelectedTopic) == -1 ? false : true"
    />
    <create-proposal-dialog :idSubject="idSubject" />
  </div>
  <div>
    <input
      type="file"
      ref="file"
      id="import-topics"
      accept=".xls,.xlsx,.docx,.jpg,.png"
      enctype="multipart/form-data"
      hidden
      @change="onUploadImportFileReport"
    />
  </div>
</template>

<script>
import TopicDialog from "./TopicDialog.vue";
import requestService from "../../api/request";
import groupService from "../../api/group";
import MaterialButton from "../../components/MaterialButton.vue";
import CreateProposalDialog from "./CreateProposalDialog.vue";
import axios from 'axios';
const $ = window.$;
export default {
  name: "list-topic-card",
  props: {
    topics: {
      type: Array,
      required: true,
    },
    idSubject: {
      type: String,
      required: true,
    },
    maxRequest: Number,
  },
  data() {
    return {
      idSelectedTopic: "",
      groups: [],
      requests: [],
      file: '',
      urlReport:""
    };
  },

  async created() {
    const groups = await groupService.get({});
    this.groups = groups.data.map((ele) => ele._id);
    const requests = await requestService.get({
      idGroup: {
        $in: this.groups,
      },
      idSubject: this.idSubject,
    });
    this.requests = requests.data;
  },
  computed: {
    validate() {
      return this.maxRequest > this.requests.length;
    },
  },
  beforeUnmount() {
    $("#creatingProposalDialog").modal("hide");
    $("#topicModal").modal("hide");
  },
  methods: {
    onOpenInputFile() {
      document.getElementById("import-topics").click();
    },
    async onUploadImportFileReport() {
    this.file =  this.$refs.file.files[0];
    console.log(this.file);
      const formData = new FormData();
      formData.append('file2', this.file);
      console.log("formData", formData);
      const accessToken = localStorage.getItem("access_token");
      axios.post('http://localhost:3000/user/api/student/upload', formData, {
       headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "multipart/form-data"
  }
})
.then(response => {
  console.log(response.data);
  this.urlReport = response.data
})
.catch(error => {
  console.log("err",error);
});
    },




    onOpenCreatingProposalDialog() {
      $("#creatingProposalDialog").modal("show");
    },
    onOpenTopicDialog(topic) {
      console.log(topic.filter.title);
      console.log(topic._id);
      if (this.validate == true || this.checkRegister(topic._id) != -1) {
        this.idSelectedTopic = topic._id;
        $("#topicModal").modal("show");
      }
    },
    async onRegisterTopic(idGroup, plan) {
      $("#topicModal").modal("hide");
      if (this.validate == true) {
        await requestService.create({
          idGroup,
          plan,
          idTopic: this.idSelectedTopic,
        });
        const requests = await requestService.get({
          idGroup: {
            $in: this.groups,
          },
        });
        this.requests = requests.data;
        this.$emit("update:topics", true);
      }
    },
    checkRegister(idTopic) {
      for (let i = 0; i < this.requests.length; i++) {
        if (this.requests[i].idTopic._id == idTopic) {
          return i;
        }
      }
      return -1;
    },
  },
  components: { TopicDialog, MaterialButton, CreateProposalDialog },
};
</script>
