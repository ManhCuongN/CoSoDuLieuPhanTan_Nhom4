const chai = require("chai");
const emailUtil = require("../../../utils/emailUtil");
const assert = chai.assert;

describe("Email Util", () => {
  describe("#Verify TDTU email", () => {
    it("should return true with valid email", (done) => {
      const email = "518h0171@student.tdtu.edu.vn";
      assert.equal(emailUtil.verifyTDTUEmail(email), true);
      done();
    });
    it("should return false with valid email 2 ", (done) => {
      const email = "518h0171@it.tdt.edu.vn";
      assert.equal(emailUtil.verifyTDTUEmail(email), true);
      done();
    });
    it("should return false with invalid email", (done) => {
      const email = "hadinhcpr1233@gmail.com";
      assert.equal(emailUtil.verifyTDTUEmail(email), false);
      done();
    });
    it("should return false with invalid email v2", (done) => {
      const email = "    ";
      assert.equal(emailUtil.verifyTDTUEmail(email), false);
      done();
    });
    it("should return false with invalid email v3", (done) => {
      assert.equal(emailUtil.verifyTDTUEmail(null), false);
      done();
    });
  });
});
