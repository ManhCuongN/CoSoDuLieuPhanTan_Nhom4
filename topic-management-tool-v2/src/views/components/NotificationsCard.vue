<template>
  <div class="card h-100 mb-4">
    <div class="card-header pb-0 px-3">
      <h6 class="mb-0">Thông báo</h6>
    </div>
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
          v-for="eventToday in today"
          :key="eventToday"
        >
          <div class="d-flex align-items-center">
            <material-button
              :color="colorEvent(eventToday.eventType)"
              variant="outline"
              size="sm"
              class="
                btn-icon-only btn-rounded
                mb-0
                me-3
                d-flex
                align-items-center
                justify-content-center
              "
            >
              <i
                :class="iconEvent(eventToday.eventType)"
                aria-hidden="true"
              ></i>
            </material-button>
            <div class="d-flex flex-column">
              <h6 class="mb-1 text-dark text-sm">
                {{ eventToday.description }}
              </h6>
              <span class="text-xs">{{
                dateFormat(eventToday.createdAt)
              }}</span>
            </div>
          </div>
          <div
            class="d-flex align-items-center text-dark text-sm font-weight-bold"
          >
            {{ eventToday.eventType }}
          </div>
        </li>
      </ul>
      <h6 class="text-uppercase text-body text-xs font-weight-bolder my-3">
        Ngày trước
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
          v-for="event in previousDays"
          :key="event"
        >
          <div class="d-flex align-items-center">
            <material-button
              :color="colorEvent(event.eventType)"
              variant="outline"
              size="sm"
              class="
                btn-icon-only btn-rounded
                mb-0
                me-3
                d-flex
                align-items-center
                justify-content-center
              "
            >
              <i :class="iconEvent(event.eventType)" aria-hidden="true"></i>
            </material-button>
            <div class="d-flex flex-column">
              <h6 class="mb-1 text-dark text-sm">
                {{ event.description }}
              </h6>
              <span class="text-xs">{{ dateFormat(event.createdAt) }}</span>
            </div>
          </div>
          <div
            class="d-flex align-items-center text-dark text-sm font-weight-bold"
          >
            {{ event.eventType }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";
import moment from "moment";

export default {
  name: "notification-card",
  props: {
    events: Array,
  },
  data() {
    return {
      today: [],
      previousDays: [],
    };
  },
  watch: {
    events() {
      let today = new Date();
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);
      this.events.forEach((ele) => {
        const date = new Date(ele.createdAt);
        if (date.getTime() >= today.getTime()) {
          this.today.push(ele);
        } else {
          this.previousDays.push(ele);
        }
      });
    },
  },
  methods: {
    dateFormat(value) {
      return moment(value).format("DD/MM/YYYY hh:mm:ss");
    },
    iconEvent(type) {
      if (type == "Tạo") {
        return "fas fa-plus";
      } else if (type == "Xóa") {
        return "fas fa-minus";
      }
      return "fa fa-pencil";
    },
    colorEvent(type) {
      if (type == "Tạo") {
        return "success";
      } else if (type == "Xóa") {
        return "danger";
      }
      return "warning";
    },
  },
  components: {
    MaterialButton,
  },
};
</script>
