<template>
  <div
    class="input-group"
    :class="`input-group-${variant} ${getStatus(error, success)}`"
  >
    <textarea
      class="form-control"
      :rows="rows"
      :name="name"
      v-model="propValue"
      :placeholder="placeholder"
      :isRequired="isRequired"
      :disabled="disabled"
    ></textarea>
  </div>
</template>

<script>
import setMaterialInput from "@/assets/js/material-input.js";

export default {
  name: "MaterialTextarea",
  props: {
    variant: {
      type: String,
      default: "outline",
    },

    name: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "Nhập thông tin ở đây...",
    },
    isRequired: Boolean,
    disabled: {
      type: Boolean,
      default: false,
    },
    rows: {
      type: Number,
      default: 5,
    },
    success: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    setMaterialInput();
  },
  computed: {
    propValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("update:value", value);
      },
    },
  },
  methods: {
    getStatus: (error, success) => {
      let isValidValue;

      if (success) {
        isValidValue = "is-valid";
      } else if (error) {
        isValidValue = "is-invalid";
      } else {
        isValidValue = null;
      }

      return isValidValue;
    },
  },
};
</script>
