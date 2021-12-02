// Get DB connection from DBSetup file
const { promise } = require('./DBSetup');
const connection = require('./DBSetup');

//Exports a function to be called by the route handler
module.exports.User = {
    getAllUsers: () => {
        return new Promise((resolve, reject) => {
            return connection.query('SELECT first_name, last_name, email, password FROM users ORDER BY id;', (err, result) => {
                if(err) reject (err);
                resolve (result);
            }); 
        });
    },
}