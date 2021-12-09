import dotenv from 'dotenv'
dotenv.config();
console.log(process.env)
let config = {
    API_URL: process.env.API_URL,
    NODE_URL: process.env.NODE_URL,
    TOKEN:'',
    PASSWRD: process.env.PASSWRD,
    BOT_TOKEN:process.env.BOTTOKEN,
    PORT:process.env.PORT
};

export {config}
