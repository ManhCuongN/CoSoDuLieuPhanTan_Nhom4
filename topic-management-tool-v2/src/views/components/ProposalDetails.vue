<template>
  <div class="h-100" v-if="proposal">
    <div class="p-3 pb-0 card-header">
      <h4 class="mb-0">{{ proposal.title }}</h4>
    </div>
    <div class="p-3 card-body">
      <strong class="text-dark text-sm">Mục tiêu đề tài:</strong>
      <p class="text-sm pre-line">
        {{ proposal.description }}
      </p>
      <hr class="my-4 horizontal gray-light" />
      <ul class="list-group">
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Kiến thức yêu cầu:</strong>
          <p class="text-sm mt-2 pre-line">
            {{ proposal.requiredSkills }}
          </p>
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Kế hoạch:</strong>
          <p class="text-sm mt-2 pre-line">
            {{ proposal.plan }}
          </p>
        </li>
        <li class="text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Giảng viên hướng dẫn mong muốn:</strong>
          &nbsp;
          {{ proposal.idTeacher.displayName }}
        </li>
        <li class="text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Phân loại:</strong> &nbsp;
          {{ proposal.filter.title }}
        </li>
        <li class="text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Môn học:</strong> &nbsp;
          {{ proposal.idSubject.title }}
        </li>

        <li class="text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Thành viên: </strong>
          &nbsp;
          <router-link
            :to="{
              name: 'Thông tin cá nhân',
              params: { idUser: user._id },
            }"
            v-for="user in proposal.idGroup.idUsers"
            :key="user"
            class="mx-1 py-1"
            ><span class="badge bg-gradient-success">{{
              user.displayName
            }}</span></router-link
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProposalDetails",
  props: {
    proposal: {
      type: Object,
      required: true,
    },
  },
};
</script>


<style scoped lang="scss">
.pre-line {
  white-space: pre-line;
}
</style>