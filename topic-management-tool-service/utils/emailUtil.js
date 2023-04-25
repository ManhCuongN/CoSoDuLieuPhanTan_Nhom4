const verifyTDTUEmail = (email) => {
  if (!email || email.trim() == "") {
    return false;
  }
  const emailParts = email.split("@");
  if (emailParts.length > 1) {
    const emailDomain = emailParts[emailParts.length - 1];
    if (
      emailDomain == "student.tdtu.edu.vn" ||
      emailDomain == "it.tdt.edu.vn"
    ) {
      return true;
    }
  }
  return false;
};

module.exports = {
  verifyTDTUEmail,
};
