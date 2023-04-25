<template>
  <div class="card">
    <div class="card-header pb-0">
      <div class="d-flex justify-content-between">
        <h5>Danh sách đề tài đã nộp</h5>
        <a class="hover" @click="onOpenCreatingDialog">
          <i class="material-icons-round opacity-10 fs-5">domain_add</i>
        </a>
      </div>
    </div>
    <div class="card-body px-0 pb-2">
      <div class="table-responsive">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th
                v-for="(heading, index) of headers"
                :key="index"
                :class="[
                  index === 0 ? 'ps-2' : '',
                  index >= 1 ? 'text-center' : '',
                ]"
                class="
                  text-uppercase text-secondary text-xs
                  font-weight-bolder
                  opacity-7
                "
              >
                {{ heading }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(resultItem, index) of results"
              :key="index"
              class="hover"
             @click="onOpenUpadtingDialog(department)"
            >
            
              <td>
                <h6 class="mb-0 text-xs">{{resultItem.idGroup}}</h6>
              </td>
              <td>
                <div class="text-center">
                  <a :href="resultItem.docxReport" @click.prevent="downloadFile(resultItem.docxReport)" download>
                   <img :src="getIcon(resultItem.docxReport)" alt="File icon" width="20" height="20"> {{ resultItem.nameFileReport || "file" }}
                  </a>
               </div>
              </td>
              <td>
                <div class="text-center">
                  <a :href="resultItem.sourceCode" @click.prevent="downloadFile(resultItem.sourceCode)" download>
                   <img :src="getIcon(resultItem.sourceCode)" alt="File icon" width="20" height="20"> {{ resultItem.nameFileSource || "file" }}
                   </a>
               </div>
              </td>
              <td>
                
                <div class="text-center">
                  <span
                 class="badge badge-sm bg-gradient-secondary"
                v-if="!resultItem.isProtected"
                @click="handleUpdateStatus(resultItem._id)"
                  >
                 Chưa Duyệt
                </span>
                <span
                  class="badge badge-sm bg-gradient-success"
                  v-else
                  @click="handleUpdateStatus(resultItem._id)"
                  >
                  Đã Duyệt
                  </span>
               </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div>
    <department-creating-dialog :onCreatingDepartment="onCreatingDepartment" />
    <department-dialog
      :department="selectedDepartment"
      :onUpdateDepartment="onUpdateDepartment"
    />

  </div>
</template>

<script>
import departmentService from "../../api/department";
import resultService from "../../api/result";
import DepartmentCreatingDialog from "./DepartmentCreatingDialog.vue";
import DepartmentDialog from "./DepartmentDialog.vue";
const $ = window.$;
import roleUtil from "../../util/roleMapper";
import firebase from 'firebase/app';
import 'firebase/storage';
// Your app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1nFU0wHmOC48ZKPimrFwjFipzBPXF3xw",
  authDomain: "test-9681a.firebaseapp.com",
  projectId: "test-9681a",
  storageBucket: "test-9681a.appspot.com",
  messagingSenderId: "359514343677",
  appId: "1:359514343677:web:cc6659221d9d939ffdd694",
  measurementId: "G-BWVYFJ15P0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default {
  name: "DepartmentCard",
  data() {
    return {
      departments: [],
      departmentName: [],
      results: [],
      headers: ["Group", "Báo Cáo", "Mã Nguồn", "Trạng thái"],
      selectedDepartment: null,
      roleUtil,
    };
  },
  beforeUnmount() {
    $("#departmentCreatingDialog").modal("hide");
    $("#departmentDialog").modal("hide");
  },

  methods: {
    getDepartmentName(departmentId) {

    const department = this.departments.find(dep => dep.id === departmentId);
    return department ? department.name : '';
  },
   async handleUpdateStatus(id) {
      await resultService.update(id) 
    },
    downloadFile(fileUrl) {
    // Tạo yêu cầu HTTP đến đường dẫn file
    fetch(fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        // Tạo URL cho đối tượng dữ liệu binary
        const url = URL.createObjectURL(blob);
        // Tạo liên kết tải xuống file
        const link = document.createElement('a');
        link.href = url;
        link.download = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Giải phóng URL sau khi tải xuống xong
        URL.revokeObjectURL(url);
      });
  },
    getIcon(fileName) {
      
  const ext = fileName.split('.').pop();
  if (ext === 'docx' || ext === 'doc') {
    return 'https://cdn.iconscout.com/icon/free/png-256/microsoft-word-1868945-1583109.png';
  } else if (ext === 'pdf') {
    return 'bi bi-file-earmark-pdf';
  } else if (ext === 'xlsx' || ext === 'xls') {
    return 'https://cdn-icons-png.flaticon.com/512/8361/8361484.png';
  } else if (ext === 'zip' || ext === 'rar') { 
    return 'https://w7.pngwing.com/pngs/986/289/png-transparent-rar-archive-file-7-zip-file-archiver-android-computer-program-expert-7z-thumbnail.png';
  }else {
    return 'https://cdn-icons-png.flaticon.com/512/3767/3767084.png';
  }
}

,
    onOpenCreatingDialog() {
      $("#departmentCreatingDialog").modal("show");
    },
    onOpenUpadtingDialog(department) {
      this.selectedDepartment = department;
      $("#departmentDialog").modal("show");
    },
    async onCreatingDepartment() {
      const departments = await departmentService.get({});
      this.departments = departments.data;
    },
    async onUpdateDepartment(idDepartment, idUser, title) {
      await departmentService.update({ idDepartment, owner: idUser, title });
      const departments = await departmentService.get({});
      this.departments = departments.data;
    },
  },

  async created() {
    // const departments = await departmentService.get({});
    // this.departments = departments.data;
    const results = await resultService.get()
    this.results = results.data
    // this.results = response.data.results;
    
  },
  components: { DepartmentCreatingDialog, DepartmentDialog  },
};
</script>
