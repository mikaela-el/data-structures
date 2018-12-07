var express = require('express'), // npm install express
    app = express();
const { Pool } = require('pg');
var AWS = require('aws-sdk');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'mikaelael';
db_credentials.host = 'combinedaa.cakaza9srb67.us-east-1.rds.amazonaws.com';
db_credentials.database = 'mikaelael';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// AWS DynamoDB credentials
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-2";

// respond to requests for /sensor
app.get('/sensor', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    // SQL query 
    var q = `SELECT EXTRACT(HOUR FROM sensorTime) as sensorhour,
             AVG(sensorValue) as num_obs
             FROM sensorData
             GROUP BY sensorhour
             ORDER BY sensorhour;`;

    client.connect();
    client.query(q, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            res.send(qres.rows);
            client.end();
            console.log('1) responded to request for sensor data');
        }
    });
});

// respond to requests for /aameetings
app.get('/aameetings', function(req, res) {

    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);
    
    // SQL query 
    var thisQuery = `SELECT newAddress, title as location, json_agg(json_build_object('day', day, 'time', startTime)) as meetings
                FROM aalocations1 
                WHERE day= 'Saturdays' or day='Sundays'
                GROUP BY newAddress, title
                ;`;

                //var thisQuery = "CREATE TABLE aalocations1 (oldAddress varchar(255),newAddress varchar(255),lat double precision, long double precision, title varchar(255), wheelc boolean, meetings integer, day varchar(100), startTime varchar(100), endTime varchar(100), meetingType varchar(50), details varchar(255));"

    client.query(thisQuery, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
        res.send(qres.rows);
        client.end();
        console.log('2) responded to request for aa meeting data');
        }
    });
});

// respond to requests for /deardiary
app.get('/deardiary', function(req, res) {

    // Connect to the AWS DynamoDB database
    var dynamodb = new AWS.DynamoDB();
    
    // DynamoDB (NoSQL) query
    var params = {
        TableName: "deardiarynewest",
        KeyConditionExpression: "#dt = :dt", // the query expression
        ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
            "#dt": "date"
        },
        ExpressionAttributeValues: { // the query values
        ":dt": {S: "Mon Oct 15 2018"}
        }
    };

    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
            res.send(data.Items);
            console.log('3) responded to request for dear diary data');
        }
    });

});

// serve static files in /public
app.use(express.static('public'));

// listen on port 8080
app.listen(8080, function() {
    console.log('Server listening...');
});