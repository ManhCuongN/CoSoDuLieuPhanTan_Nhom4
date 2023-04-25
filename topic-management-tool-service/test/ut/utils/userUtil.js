const chai = require("chai");
const userUtil = require("../../../utils/userUtil");
const assert = chai.assert;

describe("User Utils", () => {
  describe("#Verify TDTU email", () => {
    it("should remove successful strict field v1", (done) => {
      const updatedData = {
        phone: "0372466133",
        _id: "123",
      };
      const removedStrictField = { phone: "0372466133" };
      const actual = userUtil.removeStrictFields(updatedData);
      assert.deepEqual(actual, removedStrictField);
      done();
    });
    it("should remove successful strict field v2", (done) => {
      const updatedData = {
        phone: "0372466133",
        _id: "123",
        email: "1234",
      };
      const removedStrictField = { phone: "0372466133" };
      const actual = userUtil.removeStrictFields(updatedData);
      assert.deepEqual(actual, removedStrictField);
      done();
    });
    it("should remove successful strict field v2", (done) => {
      const updatedData = {
        phone: "0372466133",
        _id: "123",
        email: "1234",
        googleId: "avbc",
      };
      const removedStrictField = { phone: "0372466133" };
      const actual = userUtil.removeStrictFields(updatedData);
      assert.deepEqual(actual, removedStrictField);
      done();
    });
  });
});

const initData = () => {
  return {
    _id: "6270db918d0b4377678e877a",
    googleId: "111871262827045814965",
    email: "hadinhcpr1233@gmail.com",
    givenName: "Hà",
    familyName: "Đinh Hồng",
    photos: [
      {
        value:
          "https://lh3.googleusercontent.com/a/AATXAJx6pf2K-c9pG2WjQgwKS8QelqsuiwhK2_8huMnr=s50-mo",
      },
    ],
    __v: 0,
  };
};
