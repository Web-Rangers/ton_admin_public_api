import mysql from 'mysql2/promise'
function connect(){
    let connection =undefined;
    class DbConnection{
        constructor(){
            mysql.createConnection({
                host : process.env.DB_HOST,
                user : process.env.DB_USER,
                port : process.env.DB_PORT,
                database: process.env.DB_NAME,
                password : process.env.DB_PASSWRD,
            }).then(val=>{
                this.connection = val
            })
            
        }
    }
    if (!connection){
        connection = new DbConnection()
    }
    return connection
}
const db_connection = connect()

export default db_connection