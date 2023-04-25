<template>
  <div class="h-100 w-100" v-if="user">
    <div class="p-3 card-body row">
      <ul class="list-group col-md-6 col-12">
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <material-input
            type="text"
            label="Họ"
            class="my-2"
            :value="familyName"
            @update:value="familyName = $event"
            :success="validateFamilyName"
            :error="!validateFamilyName"
          />
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <material-input
            type="text"
            label="Tên"
            class="my-2"
            :value="givenName"
            @update:value="givenName = $event"
            :success="validateGivenName"
            :error="!validateGivenName"
          />
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <material-input
            type="text"
            label="Số điện thoại"
            class="my-2"
            :value="phone"
            @update:value="phone = $event"
            :success="validatePhone"
            :error="!validatePhone"
          />
        </li>
        <li
          class="pt-0 text-sm border-0 list-group-item ps-0"
          v-if="authData.isStudentRole()"
        >
          <material-input
            type="text"
            label="Nghành"
            class="my-2"
            :value="major"
            @update:value="major = $event"
            :success="validateMajor"
            :error="!validateMajor"
          />
        </li>
        <li
          class="pt-0 text-sm border-0 list-group-item ps-0"
          v-if="authData.isStudentRole()"
        >
          <material-input
            type="text"
            label="Lớp"
            class="my-2"
            :value="userClass"
            @update:value="userClass = $event"
            :success="validateClass"
            :error="!validateClass"
          />
        </li>
      </ul>

      <ul class="list-group col-md-6 col-12">
        <li class="pt-md-0 text-sm border-0 list-group-item ps-0">
          <label for="titleNewTopic" class="ms-0">Kỹ năng:</label>
          <material-textarea
            class="ps-0 ms-0"
            name="titleNewTopic"
            :rows="5"
            placeholder="Điền kỹ năng bản thân, có thể điền link CV"
            label-class="mb-0 text-body text-truncate w-80"
            :value="skills"
            @update:value="skills = $event"
            :success="validateSkills"
            :error="!validateSkills"
          >
          </material-textarea>
        </li>
      </ul>
      <div class="text-center">
        <button
          :disabled="!validateFamilyName || !validateGivenName"
          type="button"
          @click="onUpdateUser"
          class="btn btn-round bg-gradient-warning btn-lg w-80 mt-4 mb-0"
        >
          Cập nhật
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import MaterialInput from "../../components/MaterialInput.vue";
import MaterialTextarea from "../../components/MaterialTextarea.vue";

import userService from "../../api/user";
import authService from "../../api/login";
export default {
  name: "InputProfileCard",
  inject: ["authData"],
  data() {
    return {
      familyName: "",
      givenName: "",
      phone: "",
      major: "",
      userClass: "",
      skills: "",
    };
  },

  props: {
    user: Object,
  },
  components: {
    MaterialInput,
    MaterialTextarea,
  },
  computed: {
    validateFamilyName() {
      return this.familyName.trim() != "";
    },
    validateGivenName() {
      return this.givenName.trim() != "";
    },
    validatePhone() {
      return this.phone.trim() != "";
    },
    validateClass() {
      return this.userClass.trim() != "";
    },
    validateMajor() {
      return this.major.trim() != "";
    },
    validateSkills() {
      return this.skills.trim() != "";
    },
  },
  mounted() {
    this.familyName = this.user.familyName;

    this.givenName = this.user.givenName;
    this.phone = this.user.phone;
    this.major = this.user.major;
    this.userClass = this.user.class;
    this.skills = this.user.skills;
  },

  methods: {
    async onUpdateUser() {
      await userService.update({
        givenName: this.givenName,
        familyName: this.familyName,
        major: this.major,
        class: this.userClass,
        phone: this.phone,
        skills: this.skills,
      });
      const userData = await authService.getInfor();
      if (userData) {
        this.authData.setUser(userData.data);
        this.authData.setSignedIn(true);
        this.$emit("update:user", true);
      }
    },
  },
};
</script>
