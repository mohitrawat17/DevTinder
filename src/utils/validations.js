const validator = require("validator");


const validateUser = (data) => {
  const { emailId, password } = data;
  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid !");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password.");
  }
};

module.exports = { validateUser };
