const mongoose = require('mongoose')
const dotenv = require('dotenv')


function connection(){
    dotenv.config({path:'../.env'})
    const res = mongoose.connect(process.env.DM_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    return res
}
connection()

const moongo = mongoose.connection;
moongo.on("error", console.error.bind(console, "MongoDB connection error: "));
moongo.once("open", function () {
  console.log("Connected successfully to MongoDB!");
});

module.exports = {moongo}