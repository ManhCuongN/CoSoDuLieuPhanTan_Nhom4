<template>
  <div
    class="modal fade"
    id="scheduleDialog"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalMessageTitle"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title font-weight" id="exampleModalLabel">
            Tạo đợt đăng ký môn học
          </h6>
          <button
            type="button"
            class="btn-close text-dark"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label for="exampleFormControlSelect2" class="ms-0"
                >Chọn môn học</label
              >
              <br />
              <select class="select-subject d-block w-100">
                <option selected disabled value="">...</option>
                <option
                  :value="subject._id"
                  v-for="subject in subjects"
                  :key="subject"
                >
                  {{ subject.title }}
                </option>
              </select>
            </div>
            <div class="row mb-3">
              <div class="col-md-6 col-12">
                <material-input
                  :value="from"
                  @update:value="from = $event"
                  type="date"
                  class="my-2 is-filled"
                  :error="!validateFrom"
                  label="Nhập ngày bắt đầu"
                />
              </div>
              <div class="col-md-6 col-12">
                <material-input
                  :value="to"
                  @update:value="to = $event"
                  :error="!validateTo"
                  type="date"
                  class="my-2 is-filled"
                  label="Nhập ngày đóng"
                />
              </div>
            </div>
            <div>
              <div class="d-flex justify-content-between">
                <label for="exampleFormControlSelect2" class="ms-0"
                  >Chọn sinh viên được phép đăng ký</label
                >

                <a class="text-end hover" @click="onOpenUpload">
                  <i
                    class="text-lg fas fa-upload text-secondary"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Upload excel file"
                  ></i>
                </a>
              </div>
              <div>
                <select id="select-users" class="d-block w-100" multiple>
                  <option :value="user._id" v-for="user in users" :key="user">
                    {{ user.email }}
                  </option>
                </select>
              </div>
            </div>
            <div class="text-success text-gradient font-weight-bold text-end">
              {{ numUserChosen }} sinh viên
            </div>
          </form>
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
            :disabled="!validateFrom || !validateTo || !validateSubject"
            @click="onClickOk"
          >
            Tạo mới
          </button>
        </div>
      </div>
    </div>
  </div>
  <div>
    <input
      type="file"
      accept=".xls,.xlsx"
      id="uploadExcelFileInput"
      hidden
      @change="onChangeExcelFile"
    />
  </div>
</template>


<script>
import MaterialInput from "@/components/MaterialInput.vue";
import userService from "../../api/user";
import excelUtil from "../../util/excelUtil";

const $ = window.$;
export default {
  name: "schedule-dialog",
  components: {
    MaterialInput,
  },
  data() {
    return {
      title: "",
      from: "",
      to: "",
      idUsers: [],
      users: [],
      idSubject: "",
      emails: [],
    };
  },

  props: {
    subjects: Array,
    onCreateSchedule: Function,
  },
  async created() {
    const users = await userService.get({ role: "role_student" });
    this.users = users.data;
  },

  mounted() {
    $(".select-subject").select2({
      language: {
        noResults: function () {
          return "Không tìm thấy";
        },
      },
    });
    this.idSubject = $(".select-subject")
      .select2("data")
      .map((ele) => ele.id)[0];
    $("#select-users").select2({
      language: {
        noResults: function () {
          return "Không tìm thấy";
        },
      },
    });
    $(".select2-container").css("display", "block");
    $("#select-users").on("select2:closing", () => {
      this.idUsers = $("#select-users")
        .select2("data")
        .map((ele) => ele.id);
    });

    $(".select-subject").on("select2:closing", () => {
      this.idSubject = $(".select-subject")
        .select2("data")
        .map((ele) => ele.id)[0];
    });
  },
  computed: {
    numUserChosen() {
      return this.emails.length + this.idUsers.length;
    },
    validateFrom() {
      let from = new Date(this.from);
      from.setHours(0);
      if (from.getTime() <= new Date().getTime()) {
        return false;
      }
      return this.from != "" && this.validateRange;
    },
    validateTo() {
      return this.to != "" && this.validateRange;
    },
    validateSubject() {
      return this.idSubject && this.idSubject != "";
    },
    validateRange() {
      if (this.to != "" && this.from != "") {
        const to = new Date(this.to);
        const from = new Date(this.from);
        if (to.getTime() <= from.getTime()) {
          return false;
        }
      }
      return true;
    },
  },
  methods: {
    onClickOk() {
      if (this.validateFrom && this.validateFrom && this.validateSubject) {
        this.onCreateSchedule(
          this.idSubject,
          this.emails,
          this.idUsers,
          this.from,
          this.to
        );
        this.from = "";
        this.to = "";
        this.idSubject = "";
        this.idUsers = [];
        this.emails = [];
        $("#select-users").val([]).change();
        $("#scheduleDialog").modal("hide");
      }
    },

    onOpenUpload() {
      $("#uploadExcelFileInput").click();
    },
    async onChangeExcelFile(event) {
      const file = event.target.files[0];
      if (file) {
        const extension = file.name.split(".")[1];
        if (extension == "xls" || extension == "xlsx") {
          const emails = await excelUtil.readData(file);
          if (emails && emails.length > 0) {
            this.emails = emails;
          }
        }
      }
    },
  },
};
</script>