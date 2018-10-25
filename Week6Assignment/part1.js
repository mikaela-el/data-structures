const { Client } = require('pg');
const cTable = require('console.table');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'mikaelael';
db_credentials.host = 'combinedaa.cakaza9srb67.us-east-1.rds.amazonaws.com';
db_credentials.database = 'combinedaa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// Sample SQL statement to query meetings on Monday that start on or after 7:00pm: 
var thisQuery = "SELECT mtgday, mtgtime, mtglocation, mtgaddress, mtgtypes FROM aadata WHERE mtgday = 'Monday' and mtghour >= 7;";

// Notes From Class
    //var thisQuery = "SELECT count(*) FROM aadata;"; // number of meetings in table
    //var thisQuery = "SELECT count(distinct  mtaddress) FROM aadata;"; // number of meetings addresses 
        // what designates a point on a map and how do we group those individual meetings at that location?
        // must return a query string that outputs results that subset what we started with 
    //var thisQuery = "SELECT count distinct mtaddress FROM aadata;"; 

client.query(thisQuery, (err, res) => {
    if (err) {throw err}
    else {
        console.table(res.rows);
        client.end();
    }
});
