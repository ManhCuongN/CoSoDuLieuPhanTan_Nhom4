<template>
  <!-- Modal -->
  <div
    class="modal fade"
    id="requestModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content" v-if="request">
        <div class="modal-header">
          <h5 class="modal-title font-weight">
            {{ request.idTopic.title }}
          </h5>
          <button
            type="button"
            class="btn-close text-dark"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div
              class="col-12 col-md-6 col-xl-8 mt-md-0 mt-4 position-relative"
            >
              <div class="h-100" v-if="request">
                <div class="p-3 pb-0 card-header">
                  <div class="row">
                    <div class="col-md-8 d-flex align-items-center">
                      <h4 class="mb-0">Yêu cầu đăng ký đề tài</h4>
                    </div>
                  </div>
                </div>
                <div class="p-3 card-body">
                  <ul class="list-group">
                    <li class="pt-0 text-sm border-0 list-group-item ps-0">
                      <strong class="text-dark">Nhóm:</strong>
                      <span class="text-sm mt-2">
                        &nbsp;{{ request.idGroup.name }}</span
                      >
                    </li>
                    <li class="text-sm border-0 list-group-item ps-0">
                      <strong class="text-dark">Thành viên:</strong>

                      &nbsp;
                      <router-link
                        :to="{
                          name: 'Thông tin cá nhân',
                          params: { idUser: user._id },
                        }"
                        v-for="user in group.idUsers"
                        :key="user"
                        class="mx-1 py-1"
                        ><span class="badge bg-gradient-success">{{
                          user.displayName
                        }}</span></router-link
                      >
                    </li>
                    <li class="text-sm border-0 list-group-item ps-0">
                      <strong class="text-dark">Trạng thái:</strong>

                      &nbsp;
                      <span class="text-sm mt-2">
                        &nbsp;{{ statusMapper.mapStatus(request.status) }}</span
                      >
                    </li>
                    <li class="text-sm border-0 list-group-item ps-0">
                      <strong class="text-dark">Kế hoạch:</strong>
                      <p class="text-sm mt-2 ps-2 pre-line">
                        {{ request.plan }}
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              <hr class="vertical dark" v-if="isLock == false" />
            </div>
            <div class="col-12 col-md-6 col-xl-4 position-relative">
              <div class="card card-plain h-100">
                <div class="p-3 pb-0 card-header">
                  <h6 class="mb-0">Thao tác</h6>
                </div>
                <div class="p-3 card-body">
                  <ul class="list-group">
                    <li class="px-0 border-0 list-group-item">
                      <div class="input-group input-group-outline d-block mb-4">
                        <material-switch
                          :disabled="isLock == true"
                          :checked="isApproved"
                          @update:checked="isApproved = $event"
                          class="ps-0 ms-0"
                          name="flexSwitchCheckDefault"
                          label-class="mb-0 text-body text-truncate w-80"
                          >{{ textAction(isApproved) }}
                        </material-switch>
                      </div>
                    </li>
                    <li class="px-0 border-0 list-group-item">
                      <div class="input-group input-group-static mb-4">
                        <label for="flexSwitchCheckDefault1" class="ms-0"
                          >Lí do:</label
                        >
                        <material-textarea
                          class="ps-0 ms-0"
                          name="note"
                          :rows="2"
                          placeholder="Nhập nhận xét"
                          label-class="mb-0 text-body text-truncate w-80"
                          :value="note"
                          @update:value="note = $event"
                          :success="validateNote"
                          :error="!validateNote"
                          :disabled="isLock == true"
                        >
                        </material-textarea>
                      </div>
                    </li>
                  </ul>
                  <div class="text-center" v-if="isLock == false">
                    <button
                      type="button"
                      :disabled="!validateNote"
                      @click="onClickButton"
                      class="
                        btn btn-round
                        bg-gradient-warning
                        btn-xl
                        w-100
                        mb-0
                      "
                    >
                      Xác nhận
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn bg-gradient-danger"
            data-bs-dismiss="modal"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import groupService from "../../api/group";
import statusMapper from "../../util/statusMapper";
import MaterialSwitch from "../../components/MaterialSwitch.vue";
import MaterialTextarea from "../../components/MaterialTextarea.vue";
import {
  STATUS_APPROVED,
  STATUS_REJECTED,
  STATUS_SENDING,
} from "../../constant/statusConstant";
import requestService from "../../api/request";
const $ = window.$;
export default {
  name: "request-dialog",
  props: {
    request: {
      type: Object,
    },
    onUpdateStatus: Function,
  },
  data() {
    return {
      note: "",
      group: {},
      statusMapper,
      isApproved: false,
      isLock: false,
    };
  },

  watch: {
    async request() {
      if (this.request.status == STATUS_SENDING) {
        this.isApproved = false;
        this.isLock = false;
      } else if (this.request.status == STATUS_APPROVED) {
        this.isApproved = true;
        this.isLock = true;
      } else {
        this.isLock = true;
      }
      this.note = this.request.note;
      const idGroup = this.request.idGroup._id;
      const group = await groupService.get({ _id: idGroup });
      this.group = group.data[0];
    },
  },
  computed: {
    validateNote() {
      return this.note.trim() != "";
    },
  },
  methods: {
    async onClickButton() {
      const status =
        this.isApproved == true ? STATUS_APPROVED : STATUS_REJECTED;
      await requestService.updateStatus({
        status,
        note: this.note,
        _id: this.request._id,
      });
      this.note = "";
      this.onUpdateStatus();
      $("#requestModal").modal("hide");
    },
    textAction(status) {
      if (!status) {
        return "Không chấp nhận";
      } else {
        return "Chấp nhận";
      }
    },
  },
  components: { MaterialSwitch, MaterialTextarea },
};
</script>


<style scoped lang="scss">
#requestModal {
  z-index: 10000;
}

.pre-line {
  white-space: pre-line;
}
</style>
