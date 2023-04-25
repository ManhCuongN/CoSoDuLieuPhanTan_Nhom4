<template>
  <div>
    <div
      class="modal fade"
      id="groupDialog"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modal-form"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-body p-0">
            <div class="card card-plain">
              <div class="card-header pb-0 text-left">
                <h5 class="">Tạo nhóm mới</h5>
                <p class="mb-0">Chọn các thành viên cho nhóm của mình.</p>
              </div>
              <div class="card-body">
                <div class="input-group input-group-outline my-3">
                  <material-input
                    type="text"
                    size="lg"
                    label="Đặt tên nhóm"
                    :value="name"
                    @update:value="name = $event"
                    :success="validateName"
                    :error="!validateName"
                  />
                </div>

                <label for="exampleFormControlSelect2" class="ms-0"
                  >Chọn những thành viên khác</label
                >
                <br />
                <select class="js-example-basic-single d-block w-100" multiple>
                  <option :value="user._id" v-for="user in users" :key="user">
                    {{ user.email }}
                  </option>
                </select>

                <div
                  class="text-success text-gradient font-weight-bold text-end"
                >
                  {{ idUsers.length }} thành viên khác
                </div>
                <div class="text-center">
                  <button
                    type="button"
                    :disabled="!validateName"
                    @click="onCreateGroup"
                    class="
                      btn btn-round
                      bg-gradient-info
                      btn-lg
                      w-100
                      mt-4
                      mb-0
                    "
                  >
                    Tạo nhóm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userService from "../../api/user";
import groupService from "../../api/group";
import MaterialInput from "../../components/MaterialInput.vue";
import authData from "../../data/authData";
const $ = window.$;
export default {
  name: "group-dialog",
  inject: ["authData"],
  data() {
    return {
      name: "",
      idUsers: [],
      users: [],
    };
  },

  async created() {
    const currentUserId = authData.state.user._id;
    const users = await userService.get({ role: "role_student" });
    this.users = users.data.filter((ele) => ele._id != currentUserId);
  },
  computed: {
    validateName() {
      return this.name.trim() != "";
    },
  },
  methods: {
    async onCreateGroup() {
      if (this.validateName) {
        await groupService.create({ name: this.name, idUsers: this.idUsers });
        this.name = "";
        this.idUsers = [];
        $(".js-example-basic-single").val(null).trigger("change");
      }
      $("#groupDialog").modal("hide");
    },
  },
  mounted() {
    $(".js-example-basic-single").select2({
      language: {
        noResults: function () {
          return "Không tìm thấy";
        },
      },
    });
    $(".select2-container").css("display", "block");
    $(".js-example-basic-single").on("select2:closing", () => {
      this.idUsers = $(".js-example-basic-single")
        .select2("data")
        .map((ele) => ele.id);
    });
  },
  components: {
    MaterialInput,
  },
};
</script>

<style scoped lang="scss">
.select2-container {
  display: block !important;
  min-width: 100% !important;
}
</style>