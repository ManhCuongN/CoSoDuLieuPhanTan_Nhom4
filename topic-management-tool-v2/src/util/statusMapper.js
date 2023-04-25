import {
  STATUS_SENDING,
  STATUS_APPROVED,
  STATUS_REJECTED,
} from "../constant/statusConstant";

function mapStatus(status) {
  switch (status) {
    case STATUS_SENDING:
      return "Đang gửi";
    case STATUS_APPROVED:
      return "Đăng ký thành công";
    case STATUS_REJECTED:
      return "Đăng ký không thành công";
  }
}

export default {
  mapStatus,
};
