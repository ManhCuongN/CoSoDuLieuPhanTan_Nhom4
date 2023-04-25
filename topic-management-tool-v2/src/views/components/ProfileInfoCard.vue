<template>
  <div class="h-100 w-100" v-if="user">
    <div class="p-3 card-body row">
      <ul class="list-group col-md-6 col-12">
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Họ:</strong> &nbsp;
          {{ user.familyName }}
        </li>
        <li class="text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Tên:</strong> &nbsp; {{ user.givenName }}
        </li>
        <li class="text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Số điện thoại:</strong> &nbsp;
          {{ user.phone }}
        </li>
        <li
          class="text-sm border-0 list-group-item ps-0"
          v-if="authData.isStudentRole()"
        >
          <strong class="text-dark">Nghành:</strong> &nbsp;
          {{ user.major }}
        </li>
        <li
          class="text-sm border-0 list-group-item ps-0"
          v-if="authData.isStudentRole()"
        >
          <strong class="text-dark">Lớp:</strong> &nbsp;
          {{ user.class }}
        </li>
      </ul>

      <ul class="list-group col-md-6 col-12">
        <li class="pt-md-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Kỹ năng:</strong> &nbsp;
          <p class="text-sm mt-1 mb-0 pre-line">{{ user.skills }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfileInfoCard",
  inject: ["authData"],
  props: {
    user: Object,
  },
};
</script>

<style scoped lang="scss">
.pre-line {
  white-space: pre-line;
}
</style>
