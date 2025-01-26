//DB CRDS
<<<<<<< HEAD
const USERNAME = "shiko_admin";
const PASSWORD = "shiko3093Shiko"
const DATABASE_HOSTNAME = "database-1.cbrfev2wkv5c.eu-west-1.rds.amazonaws.com";
=======
const USERNAME = "dbmasteruser";
const PASSWORD = "ZHD5ToK:|.]OByYU%F5ys3tl-,7#H2XA"
const DATABASE_HOSTNAME = "ls-23121a88d4cbb089991485b0bec9f393441a0883.cx2su6ewedog.eu-west-2.rds.amazonaws.com";
>>>>>>> 6b97c5469da9e82d83210cbe610d8c71a768a72f
//API PORTS
const HOSTNAME = "mediahostseverip"
const SOCKETIO_PORT = process.env.PORT || 2000;
const GRAPH_PORT = process.env.PORT || 4240;
const APP_PORT = process.env.PORT || 4243;


function DATABASE()
{ 
    if(DATABASE_HOSTNAME == 'database-1.cbrfev2wkv5c.eu-west-1.rds.amazonaws.com')
        return "database-1.cbrfev2wkv5c.eu-west-1.rds.amazonaws.com"
    else
        return "hosted"

}

module.exports = {
    HOSTNAME,
    DATABASE_HOSTNAME,
    USERNAME,
    PASSWORD,
    SOCKETIO_PORT,
    GRAPH_PORT,
    APP_PORT,
    DATABASE
}
