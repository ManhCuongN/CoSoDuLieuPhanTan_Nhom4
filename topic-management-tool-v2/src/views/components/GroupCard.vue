<template>
  <div class="card">
    <div class="card-header pb-0">
      <div class="row">
        <div class="col-lg-6 col-7">
          <h5>Danh sách nhóm</h5>
          <p class="text-sm mb-0" v-html="renderDescription"></p>
        </div>
        <div class="col-lg-6 col-5 my-auto text-end">
          <div class="dropdown float-lg-end pe-4">
            <a @click="onOpenCreatingGroup" class="hover">
              <i
                class="text-lg fas fa-users text-secondary"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Tạo nhóm mới"
              ></i>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body px-0 pb-2">
      <div class="table-responsive">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th
                v-for="(heading, index) of headers"
                :key="index"
                :class="[
                  index === 0 ? 'ps-2' : '',
                  index >= 1 ? 'text-center' : '',
                ]"
                class="
                  text-uppercase text-secondary text-xxs
                  font-weight-bolder
                  opacity-7
                "
              >
                {{ heading }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(group, index) of groups"
              :key="index"
              @click="onUpdateGroup(group)"
              class="cursor-pointer"
            >
              <td>
                <div class="text-left">
                  <h6 class="mb-0 text-sm">{{ group.name }}</h6>
                </div>
              </td>
              <td>
                <div class="text-center">
                  <h6 class="mb-0 text-sm">{{ group.idUsers.length }}</h6>
                </div>
              </td>
              <td>
                <div class="avatar-group mt-2 lign-middle text-center">
                  <router-link
                    :to="{
                      name: 'Thông tin cá nhân',
                      params: { idUser: member._id },
                    }"
                    href="javascript:;"
                    class="avatar avatar-xs rounded-circle"
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    data-bs-original-title=""
                    v-for="member in group.idUsers"
                    :key="member"
                    :title="member.displayName"
                  >
                    <img
                      :src="member.picture"
                      alt="Team member"
                      referrerpolicy="no-referrer"
                    />
                  </router-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div>
    <group-dialog />
    <update-group-dialog
      :group="selectedGroup"
      :onClickUpdateGroup="onClickUpdateGroup"
    />
  </div>
</template>

<script>
import GroupDialog from "./GroupDialog.vue";
import UpdateGroupDialog from "./UpdateGroupDialog.vue";
import groupService from "../../api/group";
const $ = window.$;

export default {
  name: "groupCard",
  data() {
    return {
      groups: [],
      headers: ["Tên nhóm", "Số lượng thành viên", "Thành viên"],
      selectedGroup: null,
    };
  },
  props: {
    projects: {
      type: Array,
      required: true,
      logo: String,
      title: String,
      members: Array,
      budget: String,
      progress: {
        type: Object,
        percentage: Number,
        color: String,
      },
    },
  },
  beforeUnmount() {
    $("#groupDialog").modal("hide");
    $("#updateGroupDialog").modal("hide");
  },
  methods: {
    onOpenCreatingGroup() {
      $("#groupDialog").modal("show");
    },
    onUpdateGroup(group) {
      this.selectedGroup = group;
      $("#updateGroupDialog").modal("show");
    },
    async onClickUpdateGroup() {
      const groups = await groupService.get({});
      this.groups = groups.data;
    },
  },
  computed: {
    renderDescription() {
      return `<i class='fa fa-check text-info' aria-hidden='true'></i> <span class='font-weight-bold ms-1'>${this.groups.length} nhóm</span> đã được tạo`;
    },
  },
  async created() {
    const groups = await groupService.get({});
    this.groups = groups.data;
    $("#groupDialog").on("hide.bs.modal", async () => {
      const groups = await groupService.get({});
      this.groups = groups.data;
      console.log(groups);
    });
  },
  components: {
    GroupDialog,
    UpdateGroupDialog,
  },
};
</script>
