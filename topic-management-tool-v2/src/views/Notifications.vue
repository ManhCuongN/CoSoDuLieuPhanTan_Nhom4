<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-md-8 mx-auto">
        <notifications-card :events="events" />
      </div>
    </div>
  </div>
</template>

<script>
import NotificationsCard from "./components/NotificationsCard.vue";
import eventService from "../api/event";
export default {
  name: "Notifications",
  components: {
    NotificationsCard,
  },
  inject: ["authData"],
  data() {
    return {
      events: [],
    };
  },

  async created() {
    const idUSer = this.authData.state.user._id;
    const events = await eventService.get({ userId: idUSer });
    eventService.read();
    this.events = events.data;
  },
  methods: {},
};
</script>
