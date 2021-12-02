const dotenv = require('dotenv')
dotenv.config();

let config = {
    DM_DB_URI:process.env.DM_DB_URI,
    PORT:process.env.WS_PORT
};

export {config}
