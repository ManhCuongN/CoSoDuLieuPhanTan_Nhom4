<template>
  <div class="h-100">
    <div class="p-3 pb-0 card-header"><h6>Nhập thông tin đề tài</h6></div>
    <div class="p-3 card-body">
      <ul class="list-group">
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <label for="titleNewTopic" class="ms-0">Mã đề tài:</label>
          <material-textarea
            class="ps-0 ms-0"
            name="idNewTopic"
            :rows="2"
            label-class="mb-0 text-body text-truncate w-80"
            :value="propidTopic"
            @update:value="propidTopic = $event"
            
          >
          </material-textarea>
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <label for="titleNewTopic" class="ms-0">Tên đề tài:</label>
          <material-textarea
            class="ps-0 ms-0"
            name="titleNewTopic"
            :rows="2"
            label-class="mb-0 text-body text-truncate w-80"
            :value="propTitle"
            @update:value="propTitle = $event"
            :success="validateTitle"
            :error="!validateTitle"
          >
          </material-textarea>
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <label for="titleNewTopic" class="ms-0">Mục tiêu đề tài:</label>
          <material-textarea
            class="ps-0 ms-0"
            name="descriptionNewTopic"
            label-class="mb-0 text-body text-truncate w-80"
            :value="propDescription"
            @update:value="propDescription = $event"
            :success="validateDescription"
            :error="!validateDescription"
          >
          </material-textarea>
        </li>
        <li class="text-sm border-0 list-group-item ps-0">
          <label for="titleNewTopic" class="ms-0">Kiến thức yêu cầu:</label>
          <material-textarea
            class="ps-0 ms-0"
            name="requiredSkillNewTopic"
            label-class="mb-0 text-body text-truncate w-80"
            :value="propRequiredSkills"
            @update:value="propRequiredSkills = $event"
            :success="validateRequiredSkills"
            :error="!validateRequiredSkills"
          >
          </material-textarea>
        </li>
        <li class="text-sm border-0 list-group-item ps-0">
          <div
            class="input-group input-group-outline d-block"
            :class="validateFilter == true ? 'is-valid' : 'is-invalid'"
          >
            <label for="selectDepartment" class="ms-0">Phân loại:</label>
            <select class="form-control w-100" v-model="propFilter">
              <option
                :selected="propFilter == department._id"
                :key="department"
                v-for="department in departments"
                :value="department._id"
              >
                {{ department.title }}
              </option>
            </select>
          </div>
        </li>
        <li class="text-sm border-0 list-group-item ps-0">
          <material-input
            type="number"
            label="Số thành viên tối đa"
            class="my-2"
            :value="propNumMembers"
            @update:value="propNumMembers = $event"
            :success="validateNumMembers"
            :error="!validateNumMembers"
          />
        </li>
        <li class="text-sm border-0 list-group-item ps-0">
          <material-input
            type="number"
            label="Số nhóm tham gia đăng ký đề tài"
            class="my-2"
            :value="propNumRequests"
            @update:value="propNumRequests = $event"
            :success="validateNumRequests"
            :error="!validateNumRequests"
          />
        </li>
        <li class="text-sm border-0 list-group-item ps-0">
          <material-input
            type="number"
            label="Số nhóm đăng ký thành công đề tài"
            class="my-2"
            :value="propNumRegisters"
            @update:value="propNumRegisters = $event"
            :success="validateNumRegisters"
            :error="!validateNumRegisters"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import MaterialTextarea from "../../components/MaterialTextarea.vue";
import MaterialInput from "../../components/MaterialInput.vue";
import departmentService from "../../api/department";

export default {
  components: { MaterialTextarea, MaterialInput },
  name: "input-new-topic",
  props: {
    idTopic: String,
    title: String,
    description: String,
    requiredSkills: String,
    numMembers: Number,
    numRequests: Number,
    numRegisters: Number,
    filter: String,
  },
  data() {
    return {
      departments: [],
    };
  },
  async created() {
    const departments = await departmentService.get({});
    this.departments = departments.data;
  },
  updated() {
    this.$emit(
      "update:validForm",
      this.validateTitle &&
        this.validateDescription &&
        this.validateRequiredSkills &&
        this.validateNumMembers &&
        this.validateNumRegisters &&
        this.validateFilter &&
        this.validateNumRequests
    );
  },
  computed: {
    
    validateTitle() {
      return this.propTitle.trim() != "";
    },
    validateDescription() {
      return this.propDescription.trim() != "";
    },
    validateRequiredSkills() {
      return this.propRequiredSkills.trim() != "";
    },
    validateNumMembers() {
      return this.propNumMembers && Number(this.propNumMembers >= 1);
    },
    validateNumRegisters() {
      return this.propNumRegisters && Number(this.propNumRegisters >= 1);
    },
    validateNumRequests() {
      return this.propNumRequests && Number(this.propNumRequests >= 1);
    },
    validateFilter() {
      return this.propFilter.trim() != "";
    },
    propidTopic: {
      get() {
        return this.idTopic;
      },
      set(idTopic) {
        this.$emit("update:idTopic", idTopic);
      },
    },
    propTitle: {
      get() {
        return this.title;
      },
      set(title) {
        this.$emit("update:title", title);
      },
    },
    propDescription: {
      get() {
        return this.description;
      },
      set(description) {
        this.$emit("update:description", description);
      },
    },
    propRequiredSkills: {
      get() {
        return this.requiredSkills;
      },
      set(requiredSkills) {
        this.$emit("update:requiredSkills", requiredSkills);
      },
    },
    propNumMembers: {
      get() {
        return this.numMembers;
      },
      set(numMembers) {
        this.$emit("update:numMembers", numMembers);
      },
    },
    propNumRegisters: {
      get() {
        return this.numRegisters;
      },
      set(numRegisters) {
        this.$emit("update:numRegisters", numRegisters);
      },
    },
    propNumRequests: {
      get() {
        return this.numRequests;
      },
      set(numRequests) {
        this.$emit("update:numRequests", numRequests);
      },
    },
    propFilter: {
      get() {
        return this.filter;
      },
      set(filter) {
        this.$emit("update:filter", filter);
      },
    },
  },
};
</script>
