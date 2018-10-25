// npm install aws-sdk
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";

var dynamodb = new AWS.DynamoDB();

// this is a query object not a string 
var params = {
    // expecting an object with the following key values: 
    TableName : "deardiarydate", // deardiary table name here 
    KeyConditionExpression: "#dt = :date", // the query expression / these are referecnes to query values on line 18 
    //have to use primary key as part of the query expression 
    ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB // this is only if u need to change the name of the reference to a particular key// cant use the word "date" 
        "#ph" : "photo" // if topic were off limits ex. date = #dt 
    },
    ExpressionAttributeValues: { // the query values
        ":dt": {S: "Date"},
        // ":minDate": {N: new Date("October 15, 2018").valueOf().toString()},
        // ":maxDate": {N: new Date("October 16, 2018").valueOf().toString()}
        ":ph": {S: "Photo"},
        //":minDate": {N: new Date("September 1, 2018").valueOf().toString()},
        //":maxDate": {N: new Date("October 16, 2018").valueOf().toString()}
    }
};

dynamodb.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log("***** ***** ***** ***** ***** \n", item);
        });
    }
});