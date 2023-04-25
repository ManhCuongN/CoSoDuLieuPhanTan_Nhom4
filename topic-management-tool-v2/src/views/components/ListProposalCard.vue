<template>
  <div class="card my-4">
    <div class="card-header pb-0 px-3">
      <h6 class="mb-0">Danh sách yêu cầu đề xuất đề tài</h6>
    </div>

    <div class="card-body pt-4 p-3">
      <ul class="list-group">
        <li
          class="
            list-group-item
            border-0
            d-flex
            p-4
            mb-2
            bg-gray-100
            border-radius-lg
          "
          v-for="proposal in proposals"
          :key="proposal"
        >
          <div class="d-flex flex-column">
            <h6 class="mb-3 text-sm">{{ proposal.title }}</h6>
            <span class="mb-2 text-xs">
              Môn học:
              <span class="text-dark font-weight-bold ms-sm-2">{{
                proposal.idSubject.title
              }}</span>
            </span>
            <span class="mb-2 text-xs">
              Mục tiêu đề tài:
              <span class="text-dark font-weight-bold ms-sm-2">{{
                proposal.description
              }}</span>
            </span>
            <span class="mb-2 text-xs">
              Phân loại:
              <span class="text-dark font-weight-bold ms-sm-2">{{
                proposal.filter.title
              }}</span>
            </span>
            <span class="mb-2 text-xs">
              Giảng viên hướng dẫn:
              <span class="text-dark font-weight-bold ms-sm-2">{{
                proposal.idTeacher.displayName
              }}</span>
            </span>
            <span class="mb-2 text-xs">
              Trạng thái:
              <span
                class="badge badge-sm"
                :class="colorStatus(proposal.status)"
                >{{ statusMapper.mapStatus(proposal.status) }}</span
              >
            </span>
            <span class="mb-2 text-xs" v-if="proposal.note != ''">
              Ghi chú:
              <span class="text-dark ms-sm-2 font-weight-bold">{{
                proposal.note
              }}</span>
            </span>
            <span class="text-xs">
              Nhóm:
              <span class="text-dark ms-sm-2 font-weight-bold">{{
                proposal.idGroup.name
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
  name: "list-proposal-card",
  props: {
    proposals: {
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
