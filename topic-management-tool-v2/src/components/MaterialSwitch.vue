<template>
  <div class="form-check form-switch d-flex">
    <input
      class="form-check-input"
      :class="$attrs.class"
      type="checkbox"
      :name="name"
      v-model="propChecked"
      :disabled="disabled"
    />
    <label class="form-check-label ms-3" :class="labelClass" :for="id">
      <slot />
    </label>
  </div>
</template>

<script>
export default {
  name: "MaterialSwitch",
  props: {
    name: {
      type: String,
      required: true,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    labelClass: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    propChecked: {
      get() {
        return this.checked;
      },
      set(checked) {
        this.$emit("update:checked", checked);
      },
    },
  },
};
</script>
