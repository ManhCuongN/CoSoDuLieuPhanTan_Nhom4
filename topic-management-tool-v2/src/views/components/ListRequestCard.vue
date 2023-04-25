<template>
  <div class="card my-4">
    <div class="card-header pb-0 px-3">
      <h6 class="mb-0">Danh sách yêu cầu đăng ký đề tài</h6>
      
    </div>

    <div class="card-body pt-4 p-3">
      <ul class="list-group">
        <li
          class="list-group-item border-0"
          v-for="request in requests"
          :key="request"
        >
          <div class="d-flex flex-column bg-gray-100 border-radius-lg p-4 mb-2">
            <h6 class="mb-3 text-sm">{{ request.idTopic.title }}</h6>
            <span class="mb-2 text-xs">
              Môn học:
              <span class="text-dark font-weight-bold ms-sm-2">{{
                request.idSubject.title
              }}</span>
            </span>
            <span class="mb-2 text-xs">
              Trạng thái:
              <span
                class="badge badge-sm"
                :class="colorStatus(request.status)"
                >{{ statusMapper.mapStatus(request.status) }}</span
              >
            </span>
            <span class="mb-2 text-xs" v-if="request.note != ''">
              Ghi chú:
              <span class="text-dark ms-sm-2 font-weight-bold">{{
                request.note
              }}</span>
            </span>
            <span class="text-xs">
              Nhóm:
              <span class="text-dark ms-sm-2 font-weight-bold">{{
                request.idGroup.name
              }}</span>
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { STATUS_APPROVED, STATUS_SENDING } from "../../constant/statusConstant";
import statusMapper from "../../util/statusMapper";
export default {
  name: "list-request-card",
  props: {
    requests: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      statusMapper,
    };
  },
  methods: {
    colorStatus(status) {
      if (status == STATUS_SENDING) {
        return "bg-gradient-info";
      } else if (status == STATUS_APPROVED) {
        return "bg-gradient-success";
      } else {
        return "bg-gradient-danger";
      }
    },
  },
};
</script>
