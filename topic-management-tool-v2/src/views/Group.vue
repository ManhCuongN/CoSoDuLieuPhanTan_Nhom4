<template>
  <div class="container-fluid mt-4">
    <div class="row align-items-center">
      <div class="col-lg-12 pb-3">
        <group-card />
      </div>
    </div>
  </div>
</template>

<script>
import GroupCard from "./components/GroupCard.vue";

export default {
  name: "Group",
  data() {
    return {};
  },
  components: {
    GroupCard,
  },
};
</script>
