const dotenv = require('dotenv')
dotenv.config();

let config = {
    NODE_URL: process.env.API_URL,
    TOKEN:'',
    PASSWRD: process.env.PASSWRD,
    DM_DB_URI:process.env.DM_DB_URI,
    PORT:process.env.WS_PORT
};

export {config}
