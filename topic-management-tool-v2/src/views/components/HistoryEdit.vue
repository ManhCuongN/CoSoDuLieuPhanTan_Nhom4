<template>
  <div class="card h-100 mb-4">
    <div class="card-body pt-4 p-3">
      <h6 class="text-uppercase text-body text-xs font-weight-bolder mb-3">
        Mới nhất
      </h6>

      <ul class="list-group">
        <li
          class="
            list-group-item
            border-0
            d-flex
            justify-content-between
            ps-0
            mb-2
            border-radius-lg
          "
          v-for="event in events"
          :key="event"
        >
          <div class="d-flex align-items-center">
            <router-link
              :to="{
                name: 'Thông tin cá nhân',
                params: { idUser: event.userId._id },
              }"
            >
              <img
                referrerpolicy="no-referrer"
                :src="event.userId.picture"
                class="avatar avatar-sm me-3 border-radius-lg"
                alt="user2"
                :title="event.userId.displayName"
              />
            </router-link>

            <div class="d-flex flex-column">
              <h6 class="mb-1 text-dark text-sm">{{ event.description }}</h6>
              <span class="text-xs">{{ dateFormat(event.createdAt) }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "history-edit",
  props: {
    events: Array,
  },
  data() {
    return {};
  },
  methods: {
    dateFormat(value) {
      return moment(value).format("DD/MM/YYYY hh:mm:ss");
    },
  },
};
</script>
