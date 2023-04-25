<template>
  <div class="card mb-4">
    <div class="card-header pb-0 px-3">
      <h6 class="mb-0">Thao tác</h6>
    </div>
    <hr class="my-1 horizontal dark" />
    <div class="card-body p-3 pt-0">
      <ul class="list-group">
        <li class="mt-0 pb-0 mb-3 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Tải lên danh sách đề tài:</strong>
          &nbsp;<i
            class="fas fa-upload hover text-lg"
            @click="onOpenInputFile"
          ></i>
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Tải kết quả đăng ký thành công:</strong>
          &nbsp;<i
            class="fas fa-download hover text-lg"
            @click="onDownLoadExcelFile"
          ></i>
        </li>
      </ul>
    </div>
  </div>
  <div>
    <input
      type="file"
      id="import-topics"
      accept=".xls,.xlsx"
      hidden
      @change="onUploadImportFileReport"
    />
  </div>
</template>

<script>
import subjectService from "../../api/subject";
import excelUtil from "../../util/excelUtil";
import topicSubject from "../../api/topic";
import axios from 'axios';
export default {
  name: "list-student",
  props: { idSubject: String },
  data() {
    return {
      users: [],
    };
  },
  methods: {
    onOpenInputFile() {
      document.getElementById("import-topics").click();
    },

   async onUploadImportFileReport(event) {
    const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      axios
        .post('http://localhost:3000/student/upload', formData)
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    //end
    async onUploadImportFile(event) {
      const file = event.target.files[0];
      if (file) {
        const extension = file.name.split(".")[1];
        if (extension == "xls" || extension == "xlsx") {
          const data = await excelUtil.readTopicsData(file);
          if (data && data.length > 0) {
            console.log(data);
            await topicSubject.createByImport({
              topics: data,
              idSubject: this.idSubject,
            });
            this.$emit("update:topics", true);
          }
        }
      }
    },
    async onDownLoadExcelFile() {
      const statistic = await subjectService.getGeneralInfo({
        _id: this.idSubject,
      });
      excelUtil.writeSubjectStatistic(statistic.data);
    },
  },
  watch: {},
  components: {},
};
</script>
