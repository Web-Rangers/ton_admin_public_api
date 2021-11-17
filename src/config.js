const dotenv = require('dotenv')
dotenv.config();
console.log(process.env)
const config = {
    API_URL: process.env.API_URL,
    NODE_URL: process.env.NODE_URL,
    TOKEN:process.env.TOKEN,
    BOT_TOKEN:process.env.BOTTOKEN,
    PORT:process.env.PORT
};

module.exports= config;
