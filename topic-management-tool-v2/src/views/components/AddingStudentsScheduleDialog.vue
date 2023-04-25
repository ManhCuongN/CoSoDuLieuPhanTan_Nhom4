<template>
  <div
    class="modal fade"
    id="addStudentscheduleDialog"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalMessageTitle"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title font-weight" id="exampleModalLabel">
            Thêm sinh viên
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
            <div>
              <label for="exampleFormControlSelect2" class="ms-0"
                >Chọn sinh viên được phép đăng ký</label
              >
              <div>
                <select id="select-more-users" class="d-block w-100" multiple>
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
            :disabled="numUserChosen == 0"
            @click="onClickOk"
          >
            Cập nhật danh sách
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import userService from "../../api/user";
import subjectService from "../../api/subject";
import { ROLE_STUDENT } from "../../constant/roleConstant";

const $ = window.$;
export default {
  name: "AddingStudentDialog",

  data() {
    return {
      idUsers: [],
      users: [],
    };
  },

  props: {
    students: Array,
    onAddStudents: Function,
    idSubject: String,
  },

  watch: {
    async students() {
      const users = await userService.get({
        _id: {
          $nin: this.students,
        },
        role: ROLE_STUDENT,
      });
      this.users = users.data;
    },
  },
  mounted() {
    $("#select-more-users").select2({
      language: {
        noResults: function () {
          return "Không tìm thấy";
        },
      },
    });
    $(".select2-container").css("display", "block");
    $("#select-more-users").on("select2:closing", () => {
      this.idUsers = $("#select-more-users")
        .select2("data")
        .map((ele) => ele.id);
    });
  },
  computed: {
    numUserChosen() {
      return this.idUsers.length;
    },
  },
  methods: {
    async onClickOk() {
      if (this.numUserChosen != 0) {
        await subjectService.addStudents({
          _id: this.idSubject,
          idUsers: this.idUsers,
        });
        this.onAddStudents();

        this.idUsers = [];
        $("#select-more-users").val([]).change();
        $("#addStudentscheduleDialog").modal("hide");
      }
    },
  },
};
</script>