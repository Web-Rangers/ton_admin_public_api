const dotenv = require('dotenv')
dotenv.config();

let config = {
    NODE_URL: process.env.API_URL,
    TOKEN:'',
    DATABASE:'',
    PASSWRD: process.env.PASSWRD,
    PORT:process.env.WS_PORT
};

export {config}
