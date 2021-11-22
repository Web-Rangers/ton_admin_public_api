const mongoose = require('mongoose')
const dotenv = require('dotenv')


const moongo = async function connection(){
    dotenv.config({path:'../.env'})
    const res = await mongoose.connect(process.env.DM_DB_URI, {useNewUrlParser: true,useUnifiedTopology: true })
    return res
}

module.exports = {moongo}