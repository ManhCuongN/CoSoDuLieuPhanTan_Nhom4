<template>
  <div class="container-fluid mt-4">
    <div class="row align-items-center">
      <div class="col-lg-12 pb-3">
        <user-card />
      </div>
    </div>
  </div>
</template>

<script>
import UserCard from "./components/UserCard.vue";

export default {
  name: "ManageUser",
  data() {
    return {};
  },
  components: {
    UserCard,
  },
};
</script>
