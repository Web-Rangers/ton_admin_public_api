const dotenv = require('dotenv')
dotenv.config();
console.log(process.env)
let config = {
    PORT:process.env.PORT
};

module.exports = config;
