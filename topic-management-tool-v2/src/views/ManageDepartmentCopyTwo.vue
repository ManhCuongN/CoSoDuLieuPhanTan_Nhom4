<template>
  <div class="container-fluid mt-4">
    <div class="row align-items-center">
      <div class="col-lg-12 pb-3">
        <department-card-copy-two />
      </div>
    </div>
  </div>
</template>

<script>
import DepartmentCardCopyTwo from "./components/DepartmentCardCopyTwo.vue";

export default {
  name: "ManageDepartment",
  data() {
    return {};
  },
  components: {
    DepartmentCardCopyTwo,
  },
};
</script>
