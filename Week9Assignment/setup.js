// See week 4 and 5 assignment
// use ur own credentials and create table with time and rows 

const { Client } = require('pg');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'mikaelael';
db_credentials.host = 'combinedaa.cakaza9srb67.us-east-1.rds.amazonaws.com';
db_credentials.database = 'mikaelael';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// Sample SQL statement to create a table: 
var thisQuery = "CREATE TABLE sensorData ( sensorValue integer, sensorTime timestamp DEFAULT current_timestamp );";

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});