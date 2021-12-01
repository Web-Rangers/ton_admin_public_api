const dotenv = require('dotenv')
dotenv.config();
console.log(process.env)
let config = {
    NODE_URL: process.env.API_URL,
    TOKEN:'',
    PASSWRD: process.env.PASSWRD,
    BOT_TOKEN:process.env.BOTTOKEN,
    PORT:process.env.PORT
};

module.exports = config;
