import mysql from 'mysql2'

function connect(){
    let connection = undefined;
    class DbConnection{
        constructor(){
            this.connection = mysql.createConnection({
                host : process.env.DB_HOST,
                user : process.env.DB_USER,
                port : process.env.DB_PORT,
                database: process.env.DB_NAME,
                password : process.env.DB_PASSWRD,
            })
            this.connection.execute("CREATE TABLE IF NOT EXISTS service_ping (service_name VARCHAR(20),page_name VARCHAR(20),time BIGINT NOT NULL,latency INT,status_code INT NOT NULL,INDEX service_page (service_name, page_name,time));")
            
            this.connection.execute("CREATE TABLE IF NOT EXISTS server_ping (server_ip VARCHAR(20),server_port INT,time BIGINT NOT NULL,latency INT NOT NULL,status_code BOOLEAN NOT NULL,INDEX server_ip_port (server_ip, server_port,time));")
            
            this.connection.execute("CREATE TABLE IF NOT EXISTS status (electionId BIGINT,totalValidators INT,onlineValidators INT,startValidation BIGINT,endValidation BIGINT,startNextElection BIGINT,endElection BIGINT,last_block BIGINT,eth_bridge BOOLEAN,bsc_bridge BOOLEAN,tpsAvg VARCHAR(30),startElection BIGINT,id MEDIUMINT NOT NULL AUTO_INCREMENT,PRIMARY KEY (id));")
            
            this.connection.execute("CREATE TABLE IF NOT EXISTS status_offers (approvedPercent INT,isPassed BOOLEAN,endTime BIGINT,roundsRemaining INT);")
            
            this.connection.execute("CREATE TABLE IF NOT EXISTS status_liteservers (server_ip VARCHAR(20),server_port INT,time BIGINT NOT NULL,latency INT NOT NULL,status_code INT NOT NULL,INDEX id_server(server_ip, server_port),PRIMARY KEY (server_ip, server_port));")
            
            this.connection.execute("CREATE TABLE IF NOT EXISTS status_services (service_name VARCHAR(20),page_name VARCHAR(20),time BIGINT NOT NULL,latency INT NOT NULL,status_code INT NOT NULL,INDEX id_server(service_name, page_name), PRIMARY KEY (service_name, page_name));")
            
            this.connection.execute("CREATE TABLE IF NOT EXISTS status_transactions (from_ VARCHAR(64),hash VARCHAR(64),to_ VARCHAR(64),type VARCHAR(20),direction VARCHAR(20),block_height BIGINT,value BIGINT,message VARCHAR(200),time BIGINT);")
            //
            this.connection.execute("CREATE TABLE IF NOT EXISTS status_account_activity (account VARCHAR(64),time BIGINT,PRIMARY KEY (account));")
            
            this.connection.execute("CREATE TABLE IF NOT EXISTS status_complains (electionId BIGINT,suggestedFine INT,approvedPercent INT,isPassed BOOLEAN,createdTime BIGINT);")
            //
            this.connection.execute("CREATE TABLE IF NOT EXISTS status_validators (adnlAddr VARCHAR(200) NOT NULL,walletAddr VARCHAR(64),efficiency DOUBLE,online BOOLEAN,PRIMARY KEY (adnlAddr));")
            //
            this.connection.execute("CREATE TABLE IF NOT EXISTS validators_history (adnlAddr VARCHAR(200) NOT NULL,walletAddr VARCHAR(64), date BIGINT,increase DOUBLE,PRIMARY KEY (adnlAddr,walletAddr,date));")

            this.connection.execute("CREATE TABLE IF NOT EXISTS validators_cycle_history (date_start BIGINT NOT NULL,date_end BIGINT,  PRIMARY KEY (date_start));")
            
            this.connection.execute("alter table server_ping add column archival BOOLEAN default (0)",(err,res)=>{})

            this.connection.execute("CREATE TABLE IF NOT EXISTS status_pool (address VARCHAR(64),name VARCHAR(50),hashrate DOUBLE,miners BIGINT, dmined BIGINT,ppGH DOUBLE,PRIMARY KEY (address));")

            this.connection.execute("alter table service_ping add column archival BOOLEAN default (0)",(err,res)=>{})

            this.connection.execute("CREATE TABLE IF NOT EXISTS status_bridge (address VARCHAR(64),addr_from VARCHAR(66),addr_to VARCHAR(66), value DOUBLE,time BIGINT,bridge_name VARCHAR(8), direction VARCHAR(3), status VARCHAR(20),PRIMARY KEY (addr_from,time));")
        }
    }
    if (!connection){
        connection = new DbConnection()
    }
    return connection
}
const db_connection = connect()

export default db_connection