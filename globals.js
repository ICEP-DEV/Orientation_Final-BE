//DB CRDS
const USERNAME = "root";
const PASSWORD = ""
const DATABASE_HOSTNAME = "localhost";
//API PORTS
const HOSTNAME = "mediahostseverip"
const SOCKETIO_PORT = process.env.PORT || 2000;
const GRAPH_PORT = process.env.PORT || 3000;
const APP_PORT = process.env.PORT || 4000;


function DATABASE()
{ 
    if(DATABASE_HOSTNAME == 'localhost')
        return "localhost"
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