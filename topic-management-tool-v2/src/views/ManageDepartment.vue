<template>
  <div class="container-fluid mt-4">
    <div class="row align-items-center">
      <div class="col-lg-12 pb-3">
        <department-card />
      </div>
    </div>
  </div>
</template>

<script>
import DepartmentCard from "./components/DepartmentCard.vue";

export default {
  name: "ManageDepartment",
  data() {
    return {};
  },
  components: {
    DepartmentCard,
  },
};
</script>
