const crypto = require("crypto");

module.exports.Crypto = {
  hashThis: (stringToHash) => {
    const encryptString = crypto
      .createHash("sha256")
      .update(stringToHash)
      .digest("base64");

    return encryptString;
  },
};
