<template>
  <!-- Modal -->
  <div
    class="modal fade"
    id="ProposalAdminModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    v-if="idSelectedProposal != null"
  >
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content" v-if="proposal">
        <div class="modal-header">
          <h5 class="modal-title font-weight-normal font-weight-bold">
            Yêu cầu đề xuất đề tài
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
            <div class="col-12 col-xl-8 mt-md-0 mt-4 position-relative">
              <proposal-details :proposal="proposal" />
              <hr class="vertical dark" />
            </div>

            <div class="col-12 col-xl-4 position-relative">
              <div class="card card-plain h-100">
                <div class="p-3 pb-0 card-header">
                  <h6 class="mb-0 text-danger">
                    Đề xuất {{ isApproved == true ? "đã" : "chưa" }} được{{
                      checkRole()
                    }}
                    duyệt
                  </h6>
                </div>
                <div class="p-3 card-body">
                  <ul class="list-group">
                    <li class="px-0 border-0 list-group-item">
                      <div
                        class="input-group input-group-outline d-block mb-4"
                        :class="
                          validateTeacher == true ? 'is-valid' : 'is-invalid'
                        "
                      >
                        <label for="exampleFormControlSelect1" class="ms-0"
                          >Giảng viên hướng dẫn:</label
                        >

                        <select
                          class="form-control w-100"
                          v-model="idTeacher"
                          :disabled="isDisabled == true"
                        >
                          <option
                            v-for="teacher in teachers"
                            :key="teacher"
                            :value="teacher._id"
                            :selected="idTeacher"
                          >
                            {{ teacher.displayName }}
                          </option>
                        </select>
                      </div>
                    </li>
                    <li class="px-0 border-0 list-group-item">
                      <div class="input-group input-group-static mb-4">
                        <label for="flexSwitchCheckDefault1" class="ms-0"
                          >Ghi chú:</label
                        >
                        <material-textarea
                          :disabled="isDisabled == true"
                          class="ps-0 ms-0"
                          name="flexSwitchCheckDefault1"
                          label-class="mb-0 text-body text-truncate w-80"
                          :value="note"
                          @update:value="note = $event"
                          placeholder="Nhập lí do cho yêu cầu đề xuất đề tài"
                          :success="validateNote"
                          :error="!validateNote"
                        >
                        </material-textarea>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn bg-gradient-secondary"
            data-bs-dismiss="modal"
          >
            Đóng
          </button>
          <button
            v-if="isDisabled == false"
            type="button"
            class="btn bg-gradient-primary"
            :disabled="!validateNote"
            @click="onClickButton(false)"
          >
            Từ chối
          </button>
          <button
            v-if="isDisabled == false"
            type="button"
            class="btn bg-gradient-success"
            :disabled="!validateNote"
            @click="onClickButton(true)"
          >
            Duyệt
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import ProposalDetails from "./ProposalDetails.vue";
import MaterialTextarea from "../../components/MaterialTextarea.vue";
import proposalService from "../../api/proposal";
import {
  STATUS_APPROVED,
  STATUS_REJECTED,
} from "../../constant/statusConstant";
import { ROLE_TEACHER } from "../../constant/roleConstant";
import userService from "../../api/user";
const $ = window.$;
export default {
  name: "ProposalAdminDialog",
  inject: ["authData"],
  props: {
    idSelectedProposal: {
      type: String,
    },
  },
  data() {
    return {
      proposal: null,
      note: "",
      isApproved: false,
      idTeacher: "",
      teachers: [],
      isDisabled: false,
    };
  },

  computed: {
    validateNote() {
      return this.note.trim() != "";
    },
    validateTeacher() {
      return this.idTeacher.trim() != "";
    },
  },
  methods: {
    checkRole() {
      if (this.authData.isHDRole()) {
        return " trưởng bộ môn ";
      } else if (this.authData.isDeanRole()) {
        return " trưởng khoa ";
      }
    },
    async onClickButton(value) {
      if (this.validateNote && this.validateTeacher) {
        await proposalService.updateStatus({
          isApproved: value,
          note: this.note,
          _id: this.idSelectedProposal,
          idTeacher: this.idTeacher,
        });
        this.proposal = null;
        this.note = "";
        this.idTeacher = "";
        this.$emit("update:proposals", true);
        $("#ProposalAdminModal").modal("hide");
      }
    },
  },
  async created() {
    const teachers = await userService.get({ role: ROLE_TEACHER });
    this.teachers = teachers.data;
  },
  components: {
    ProposalDetails,
    MaterialTextarea,
  },
  watch: {
    async idSelectedProposal() {
      if (this.idSelectedProposal != "") {
        const proposal = await proposalService.get({
          _id: this.idSelectedProposal,
        });
        this.proposal = proposal.data[0];
        this.idTeacher = this.proposal.idTeacher._id;
        this.note = this.proposal.note;
        if (this.proposal.status == STATUS_REJECTED) {
          this.isDisabled = true;
          this.isApproved = false;
        } else if (this.proposal.status == STATUS_APPROVED) {
          this.isApproved = true;
          this.isDisabled = true;
        } else {
          if (this.authData.isHDRole() == true) {
            if (this.proposal.ready == true) {
              this.isDisabled = true;
              this.isApproved = true;
            } else {
              this.isDisabled = false;
              this.isApproved = false;
            }
          } else if (this.authData.isDeanRole() == true) {
            if (this.proposal.confirm == true) {
              this.isDisabled = true;
              this.isApproved = true;
            } else {
              this.isDisabled = false;
              this.isApproved = false;
            }
          }
        }
      }
    },
  },
};
</script>


<style scoped lang="scss">
#ProposalAdminModal {
  z-index: 10000;
}
</style>