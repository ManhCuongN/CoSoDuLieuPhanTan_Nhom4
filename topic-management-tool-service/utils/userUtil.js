const {
  CREATED_AT,
  UPDATED_AT,
  EMAIL,
  GOOGLE_ID,
  ROLE,
  _ID,
  __V,
} = require("../constant/constant");

const LIST_STRICT_FIELD = [
  CREATED_AT,
  UPDATED_AT,
  EMAIL,
  GOOGLE_ID,
  ROLE,
  _ID,
  __V,
];

const removeStrictFields = (updatedData) => {
  if (updatedData && typeof updatedData == "object") {
    const data = { ...updatedData };
    LIST_STRICT_FIELD.forEach((ele) => {
      delete data[ele];
    });
    return data;
  } else {
    throw new Error("Updated data should be object");
  }
};

module.exports = {
  removeStrictFields,
};
