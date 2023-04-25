<template>
  <ul class="list-group">
    <li class="pt-0 text-sm border-0 list-group-item ps-0">
      <strong class="text-dark">Tổng số đề tài:</strong> &nbsp; {{ numTopics }}
    </li>
    <li class="text-sm border-0 list-group-item ps-0">
      <strong class="text-dark">Tổng số yêu cầu đăng ký:</strong> &nbsp;
      {{ numRequests }}
    </li>
  </ul>
</template>

<script>
export default {
  name: "ScheduleInfoCard",
  props: {
    numTopics: Number,
    numRequests: Number,
  },
};
</script>
