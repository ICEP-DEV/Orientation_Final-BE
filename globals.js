//DB CRDS
const USERNAME = "shiko_admin";
const PASSWORD = "shiko3093Shiko"
const DATABASE_HOSTNAME = "database-1.cbrfev2wkv5c.eu-west-1.rds.amazonaws.com";
//API PORTS
const HOSTNAME = "mediahostseverip"
const SOCKETIO_PORT = process.env.PORT || 2000;
const GRAPH_PORT = process.env.PORT || 3000;
const APP_PORT = process.env.PORT || 3000;


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