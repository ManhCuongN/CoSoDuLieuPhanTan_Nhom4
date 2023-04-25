const STATUS_NEW = "NEW";
const STATUS_SEEN = "SEEN";
//STUDENT

const REGISTER_TOPIC = "Đã đăng ký đề tài mới";
const CREATE_GROUP = "Đã tạo một nhóm mới";
const CREATE_REQUEST = "Đã tạo một yêu cầu đăng ký";
const CREATE_PROPOSAL = "Đã tạo một yêu cầu đề xuất đề tài";
const INVITE_SUBJECT = "Bạn đã được thêm vào một môn học";

const REJECT_PROPOSAL = "Yêu cầu đề xuất đề tài của nhóm đã bị từ chối";
const APPROVE_PROPOSAL = "Yêu cầu đề xuất đề tài của nhóm đã được chấp nhận";

const REJECT_REQUEST = "Yêu cầu đăng ký đề tài của nhóm đã bị từ chối";
const APPROVE_REQUEST = "Yêu cầu đăng ký đề tài của nhóm đã được chấp nhận";

const UPDATE_GROUP = "Bạn đã cập nhật nhóm";
const UPDATE_GROUP_BY_OTHERS = "Nhóm đã được cập nhật bởi thành viên khác";

const INVITE_GROUP = "Bạn được thêm vào một nhóm mới";

//TEACHER  MANAGER

const CREATE_SUBJECT = "Bạn đã tạo một môn học";
const UPDATE_SUBJECT = "Bạn đã cập nhật môn học";
const CREATE_SCHEDULE = "Bạn đã tạo một đợt đăng ký mới";

const UPDATE_SCHEDULE = "Bạn đã cập nhật đợt đăng ký";

const CREATE_TOPIC = "Bạn đã tạo một đề tài";
const UPDATE_TOPIC = "Đã cập nhật đề tài";
const DELETE_TOPIC = "Đã xóa đề tài";
const ADD_NOTE = "Đã thêm ghi chú";

const CREATE_DEPARTMENT = "Bạn đã tạo một bộ môn";
const UPDATE_DEPARTMENT = "Bạn đã cập nhật bộ môn";

module.exports = {
  ADD_NOTE,
  REGISTER_TOPIC,
  CREATE_GROUP,
  CREATE_SUBJECT,
  CREATE_TOPIC,
  UPDATE_TOPIC,
  DELETE_TOPIC,
  CREATE_SCHEDULE,
  CREATE_GROUP,
  CREATE_REQUEST,
  CREATE_PROPOSAL,
  INVITE_GROUP,
  STATUS_NEW,
  STATUS_SEEN,
  UPDATE_SUBJECT,
  CREATE_DEPARTMENT,
  UPDATE_DEPARTMENT,
  UPDATE_GROUP,
  UPDATE_GROUP_BY_OTHERS,
  REJECT_PROPOSAL,
  APPROVE_PROPOSAL,
  REJECT_REQUEST,
  APPROVE_REQUEST,
  UPDATE_SCHEDULE,
  INVITE_SUBJECT,
};
