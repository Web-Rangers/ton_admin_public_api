const dotenv = require('dotenv')
dotenv.config();
console.log(process.env)
let config = {
    PORT:process.env.PORT,
    DM_DB_URI:process.env.DM_DB_URI,
};

export {config}
