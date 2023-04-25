import { reactive, readonly } from "vue";

const state = reactive({
  loading: false,
  alert: [],
});

const setLoading = function (loading) {
  state.loading = loading;
};

const createAlert = function (type, message) {
  state.alert.push({ type, message });
};

export default {
  state: readonly(state),
  setLoading,
  createAlert,
};
