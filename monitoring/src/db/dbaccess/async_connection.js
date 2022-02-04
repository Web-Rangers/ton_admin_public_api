import mysql from 'mysql2/promise'
function connect(){
    let connection =undefined;
    class DbConnection{
        constructor(){
            this.connection = mysql.createPool({
                host : process.env.DB_HOST,
                user : process.env.DB_USER,
                port : process.env.DB_PORT,
                database: process.env.DB_NAME,
                password : process.env.DB_PASSWRD,
            })  
        }
    }
    if (!connection){
        connection = new DbConnection()
    }
    return connection
}
const async_connection = connect()

export default async_connection