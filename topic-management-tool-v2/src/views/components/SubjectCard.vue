<template>
  <div
    class="card mb-4 hover"
    :class="directionReverse ? reverseDirection : ''"
    @click="onClick"
  >
    <div class="card-header p-3 pt-2">
      <div
        class="
          icon icon-lg icon-shape
          shadow
          text-center
          border-radius-xl
          mt-n4
          position-absolute
        "
        :class="`bg-gradient-${icon.background} shadow-${icon.background}`"
      >
        <i
          class="material-icons opacity-10"
          :class="icon.color"
          aria-hidden="true"
          >{{ icon.name }}</i
        >
      </div>
      <div class="pt-1 text-end">
        <p class="text-sm mb-0 text-capitalize">{{ title.text }}</p>
        <h4 class="mb-0">{{ title.value }}</h4>
      </div>
    </div>
    <hr class="dark horizontal my-0" />
    <div class="card-footer p-3 text-end">
      <!--  eslint-disable-next-line vue/no-v-html -->
      <p class="mb-0" v-html="detail"></p>
    </div>
  </div>
</template>

<script>
export default {
  name: "subject-card",
  data() {
    return {
      reverseDirection: "flex-row-reverse justify-content-between",
    };
  },
  methods: {
    onClick() {
      this.$router.push({
        name: this.redirectUrl,
        params: { idSubject: this.id, subject: this.name },
      });
    },
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    title: {
      type: Object,
      required: true,
      text: String,
      value: [Number, String],
    },
    detail: {
      type: String,
      default: "",
    },
    icon: {
      type: Object,
      required: true,
      name: String,
      color: String,
      background: String,
      default: () => ({
        color: "text-white",
        background: "success",
      }),
    },
    directionReverse: {
      type: Boolean,
      default: false,
    },
    redirectUrl: {
      type: String,
      required: true,
    },
  },
};
</script>
