<template>
  <!-- Modal -->
  <div
    class="modal fade"
    id="creatingProposalDialog"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title font-weight" id="exampleModalLabel">
            Tạo đề xuất đề tài mới
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
          <div class="h-100">
            <div class="p-3 pb-0 card-header">
              <h6 class="mb-0">Nhập thông tin đề xuất</h6>
            </div>
            <div class="p-3 card-body">
              <ul class="list-group">
                <li class="pt-0 text-sm border-0 list-group-item ps-0">
                  <label for="titleNewTopic" class="ms-0">Tên đề tài:</label>
                  <material-textarea
                    class="ps-0 ms-0"
                    name="titleNewTopic"
                    :rows="2"
                    label-class="mb-0 text-body text-truncate w-80"
                    :value="title"
                    @update:value="title = $event"
                    :success="validateTitle"
                    :error="!validateTitle"
                  >
                  </material-textarea>
                </li>
                <li class="pt-0 text-sm border-0 list-group-item ps-0">
                  <label for="titleNewTopic" class="ms-0"
                    >Mục tiêu đề tài:</label
                  >
                  <material-textarea
                    class="ps-0 ms-0"
                    name="descriptionNewTopic"
                    label-class="mb-0 text-body text-truncate w-80"
                    :value="description"
                    @update:value="description = $event"
                    :success="validateDescription"
                    :error="!validateDescription"
                  >
                  </material-textarea>
                </li>
                <li class="text-sm border-0 list-group-item ps-0">
                  <label for="titleNewTopic" class="ms-0"
                    >Kiến thức yêu cầu:</label
                  >
                  <material-textarea
                    class="ps-0 ms-0"
                    name="requiredSkillNewTopic"
                    label-class="mb-0 text-body text-truncate w-80"
                    :value="requiredSkills"
                    @update:value="requiredSkills = $event"
                    :success="validateRequiredSkills"
                    :error="!validateRequiredSkills"
                  >
                  </material-textarea>
                </li>
                <li class="text-sm border-0 list-group-item ps-0">
                  <label for="titleNewTopic" class="ms-0">Kế hoạch:</label>
                  <material-textarea
                    class="ps-0 ms-0"
                    name="requiredSkillNewTopic"
                    label-class="mb-0 text-body text-truncate w-80"
                    :value="plan"
                    @update:value="plan = $event"
                    :success="validatePlan"
                    :error="!validatePlan"
                  >
                  </material-textarea>
                </li>
                <li class="text-sm border-0 list-group-item ps-0">
                  <div
                    class="input-group input-group-outline d-block"
                    :class="validateFilter == true ? 'is-valid' : 'is-invalid'"
                  >
                    <label for="selectDepartment" class="ms-0"
                      >Phân loại:</label
                    >
                    <select class="form-control w-100" v-model="filter">
                      <option
                        :selected="filter == department._id"
                        :key="department"
                        v-for="department in departments"
                        :value="department._id"
                      >
                        {{ department.title }}
                      </option>
                    </select>
                  </div>
                </li>
                <li class="px-0 border-0 list-group-item">
                  <div
                    class="input-group input-group-outline d-block mb-4"
                    :class="validateGroup == true ? 'is-valid' : 'is-invalid'"
                  >
                    <label for="exampleFormControlSelect1" class="ms-0"
                      >Nhóm:</label
                    >

                    <select
                      class="form-control w-100"
                      id="exampleFormControlSelect1"
                      v-model="idGroup"
                    >
                      <option
                        v-for="group in groups"
                        :key="group"
                        :value="group._id"
                        :selected="idGroup"
                      >
                        {{ group.name }}
                      </option>
                    </select>
                  </div>
                </li>
                <li class="px-0 border-0 list-group-item">
                  <div
                    class="input-group input-group-outline d-block mb-4"
                    :class="validateTeacher == true ? 'is-valid' : 'is-invalid'"
                  >
                    <label for="exampleFormControlSelect1" class="ms-0"
                      >Giảng viên hướng dẫn:</label
                    >

                    <select
                      class="form-control w-100"
                      id="exampleFormControlSelect1"
                      v-model="idTeacher"
                    >
                      <option
                        v-for="teacher in teachers"
                        :key="teacher"
                        :value="teacher._id"
                        :selected="idTeacher"
                      >
                        {{ teacher.displayName }}
                      </option>
                    </select>
                  </div>
                </li>
              </ul>
            </div>
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
            @click="onCreatingProposal"
            :disabled="!validateForm"
          >
            Đề xuất
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import departmentService from "../../api/department";
import proposalService from "../../api/proposal";
import groupService from "../../api/group";
import subjectService from "../../api/subject";
import userService from "../../api/user";
import { ROLE_TEACHER } from "../../constant/roleConstant";
import MaterialTextarea from "../../components/MaterialTextarea.vue";
const $ = window.$;

export default {
  name: "creating-topic-dialog",
  data() {
    return {
      title: "",
      description: "",
      requiredSkills: "",
      filter: "",
      idTeacher: "",
      plan: "",
      idGroup: "",
      validForm: false,
      departments: [],
      groups: [],
      teachers: [],
    };
  },
  computed: {
    validateTitle() {
      return this.title.trim() != "";
    },
    validateDescription() {
      return this.description.trim() != "";
    },
    validateRequiredSkills() {
      return this.requiredSkills.trim() != "";
    },
    validatePlan() {
      return this.plan.trim() != "";
    },
    validateGroup() {
      return this.idGroup.trim() != "";
    },
    validateFilter() {
      return this.filter.trim() != "";
    },
    validateTeacher() {
      return this.idTeacher.trim() != "";
    },
    validateForm() {
      return (
        this.validateTitle &&
        this.validateDescription &&
        this.validateRequiredSkills &&
        this.validatePlan &&
        this.validateGroup &&
        this.validateTeacher &&
        this.validateFilter
      );
    },
  },
  props: {
    idSubject: {
      type: String,
      required: true,
    },
  },
  async created() {
    const departments = await departmentService.get({});
    this.departments = departments.data;
    const teachers = await userService.get({ role: ROLE_TEACHER });
    this.teachers = teachers.data;
    const subjects = await subjectService.get({ _id: this.idSubject });
    const groups = await groupService.get({});
    this.groups = groups.data;
    this.groups = groups.data;
    const membersSubject = subjects.data[0].students;
    this.groups.filter((ele) => {
      ele.idUsers.forEach((user) => {
        if (membersSubject.indexOf(user._id) == -1) {
          return false;
        }
      });
      return true;
    });
  },
  methods: {
    async onCreatingProposal() {
      await proposalService.create({
        idSubject: this.idSubject,
        title: this.title,
        description: this.description,
        requiredSkills: this.requiredSkills,
        idTeacher: this.idTeacher,
        plan: this.plan,
        filter: this.filter,
        idGroup: this.idGroup,
      });
      this.title = "";
      this.description = "";
      this.requiredSkills = "";
      this.filter = "";
      this.idTeacher = "";
      this.plan = "";
      this.idGroup = "";
      $("#creatingProposalDialog").modal("hide");
    },
  },
  components: {
    MaterialTextarea,
  },
};
</script>


<style scoped lang="scss">
#creatingProposalDialog {
  z-index: 10000;
}
</style>