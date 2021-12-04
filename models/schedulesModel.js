// Get DB connection from DBSetup file
const connection = require("./DBSetup");

//Exports a function to be called by the /users route handler
module.exports.Schedule = {
  getAllSchedules: () => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT user_id, day, start_time, end_time FROM schedules order by user_id;",
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  },
  createANewSchedule: (records) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO schedules ( user_id, day, start_time, end_time ) VALUES (?);",
        [records],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  },
};
