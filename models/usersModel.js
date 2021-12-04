// Get DB connection from DBSetup file
const connection = require("./DBSetup");

//Exports a function to be called by the /users route handler
module.exports.User = {
  getAllUsers: () => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT first_name, last_name, email, password FROM users ORDER BY id;",
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  },
  getUsersByID: (ID) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT first_name, last_name, email, password FROM users WHERE id = ?;",
        ID,
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  },
  getSchedulesForAUserByID: (ID) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT user_id, day, start_time, end_time FROM schedules WHERE user_id = ?;",
        ID,
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  },
  createANewUser: (userData) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO users (first_name, last_name, email, password) VALUES (?);",
        [userData],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  },
};
