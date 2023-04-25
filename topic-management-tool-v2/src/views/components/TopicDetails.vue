<template>
  <div v-if="topic">
    <div class="p-3 pb-0 card-header">
      <div class="row">
        <div class="col-md-8 d-flex align-items-center">
          <h4 class="mb-0">{{ topic.title }}</h4>
        </div>
      </div>
    </div>
    <div class="p-3 card-body">
      <strong class="text-dark text-sm">Mục tiêu đề tài:</strong>
      <p class="text-sm pre-line">
        {{ topic.description }}
      </p>
      <hr class="my-4 horizontal gray-light" />
      <ul class="list-group">
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Kiến thức yêu cầu:</strong>
          <p class="text-sm mt-2 pre-line">
            {{ topic.requiredSkills }}
          </p>
        </li>
        <li class="text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Giảng viên hướng dẫn:</strong> &nbsp;
          {{ topic.idTeacher.displayName }}
        </li>
        <li class="text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Phân loại:</strong> &nbsp;
          {{ topic.filter.title }}
        </li>
        <li class="text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Số lượng thành viên tối đa:</strong> &nbsp;
          {{ topic.numMembers }}
        </li>
        <li class="text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Giới hạn đăng ký đề tài:</strong> &nbsp;
          {{ topic.numRegisters }}/{{ topic.limit }}
        </li>
        <li class="mt-0 pb-0 mb-3 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Tải lên báo cáo đề tài:</strong>
          &nbsp;<i
            class="fas fa-upload hover text-lg"
            @click="onOpenInputFile"
          ></i>
        </li> 
        <div v-if="imgAttrs">
             <a v-bind:href="imgAttrs">
              {{ originName }}
             </a>
        </div>


       
      
        <li class="mt-0 pb-0 mb-3 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Tải lên source code:</strong>
          &nbsp;<i
            class="fas fa-upload hover text-lg"
            @click="onOpenInputFileSource"
          ></i>
        </li> 
        <div v-if="imgAttrs2">
             <a v-bind:href="imgAttrs2">
              {{ originName2 }}
             </a>
        </div>
        <button
            type="button"
            class="btn bg-gradient-success"
            data-bs-dismiss="modal"
            @click="submitReportAndSource"
          >
            Cập nhật
          </button>
         
        <!-- <li class="pb-0 border-0 list-group-item ps-0">
          <strong class="text-sm text-dark">Giới hạn đăng ký đề tài:</strong>
          &nbsp;
          <a
            v-for="({ icon, link }, index) of social"
            :key="index"
            class="py-0 mb-0 btn-simple ps-1 pe-2"
            :href="link"
          >
            <i :class="`fa fa-brands ${icon}`"></i>
          </a> -->
        <!-- </li> -->
      </ul>
    </div>
  </div>
  <div>
    <input
      type="file"
      ref="file"
      id="import-topics"
      accept=".xls,.xlsx,.docx,.jpg,.png,.zip"
      enctype="multipart/form-data"
      hidden
      @change="onUploadImportFileReport"
    />
  </div>
  <div>
    <input
      type="file"
      ref="file2"
      id="import-topics-2"
      accept=".xls,.xlsx,.docx,.jpg,.png,.zip"
      enctype="multipart/form-data"
      hidden
      @change="onUploadImportFileSource"
    />
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "topic-details",
  props: {
    topic: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      file: '',
      urlReport:"",
      imgAttrs:"",
      imgAttrs2:"",
      originName: "",
      originName2: "",
      url: "https://firebasestorage.googleapis.com/v0/b/test-9681a.appspot.com/o/1680079330518_1679835242743_Leader%20DFK%20DN%202019S.xlsx"
    };
  },

  methods: {
    


    onOpenInputFile() {
      document.getElementById("import-topics").click();
    },
    onOpenInputFileSource() {
      document.getElementById("import-topics-2").click();
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
  
  console.log(response.data.url);
  console.log(response.data.originalName);
   this.imgAttrs = response.data.url
   this.originName = response.data.originalName
})
.catch(error => {
  console.log("err",error);
});
    },
    async onUploadImportFileSource() {
    this.file =  this.$refs.file2.files[0];
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
   this.imgAttrs2 = response.data.url
   this.originName2 = response.data.originalName

})
.catch(error => {
  console.log("err",error);
});
    },

    async submitReportAndSource() {
    
      const accessToken = localStorage.getItem("access_token");
      const data = {
        report: this.imgAttrs,
        source: this.imgAttrs2,
        nameFileReport: this.originName,
        nameFileSource: this.originName2,      
        topicFilter: this.topic.filter.title
      }
      axios.post("http://localhost:3000/user/api/student/submit", data,
      {
       headers: {
    Authorization: `Bearer ${accessToken}`,
  }
}).then(() => {
  console.log("succes");
}).catch(err => {
  console.log(err);
})
    },

    //end
  },

};
</script>


<style scoped lang="scss">
.pre-line {
  white-space: pre-line;
}
</style>