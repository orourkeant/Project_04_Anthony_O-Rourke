// Get DB connection from DBSetup file
const connection = require("./DBSetup");

module.exports.Login = {
  getPassByEmail: (email) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT password FROM users WHERE email = (?)",
        email,
        (err, result) => {
          if (err) {
            console.log("Problem getting password from DB in Login module!");
            reject(err);
          }
          resolve(result);
        }
      );
    });
  },
};
