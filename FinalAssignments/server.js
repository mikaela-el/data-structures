var express = require('express'), // npm install express
    app = express();
const { Pool } = require('pg');
var AWS = require('aws-sdk');
const moment = require('moment-timezone'); // moment-timezone --save

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'mikaelael';
db_credentials.host = 'combinedaa.cakaza9srb67.us-east-1.rds.amazonaws.com';
db_credentials.database = 'mikaelael';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// // respond to requests for index 
// app.get('/', (req, res) => {
//   res.render('index')
// });

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

var s1x = `<!DOCTYPE html>
<meta charset="utf-8">
<!-- Adapted from: http://bl.ocks.org/Caged/6476579 -->
<style>
body {
  font: 10px sans-serif;
}
.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}
.bar {
  fill: orange;
}
.bar:hover {
  fill: orangered ;
}
.x.axis path {
  display: none;
}
.d3-tip {
  line-height: 1;
  font-weight: bold;
  padding: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 2px;
}
/* Creates a small triangle extender for the tooltip */
.d3-tip:after {
  box-sizing: border-box;
  display: inline;
  font-size: 10px;
  width: 100%;
  line-height: 1;
  color: rgba(0, 0, 0, 0.8);
  position: absolute;
  text-align: center;
}
/* Style northward tooltips differently */
.d3-tip.n:after {
  margin: -1px 0 0 0;
  top: 100%;
  left: 0;
}
</style>
<body>
<script src="https://d3js.org/d3.v3.min.js"></script>
<script src="https://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js"></script>
<script>
var data = `;

var s2x = `; 
var margin = {top: 300, right: 20, bottom: 30, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    
var formatDecimal = d3.format(".1f");

var time = []

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);
    
var y = d3.scale.linear()
    .range([height, 0]);
    
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
    
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatDecimal);
    
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Value:</strong> <span style='color:red'>" + formatDecimal(d.num_obs) + "</span>";
  })
  
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
svg.call(tip);
  x.domain(data.map(function(d) { return d.sensorhour; }));
  y.domain([0, d3.max(data, function(d) { return d.num_obs; })]);
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 10)
      .attr("dy", ".2em")
      .style("text-anchor", "end")
      .text("Value");
  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.sensorhour); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.num_obs); })
      .attr("height", function(d) { return height - y(d.num_obs); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
</script>`;

app.get('/ss', function(req, res) {
    
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
            var resp = s1x + JSON.stringify(qres.rows) + s2x; 
            res.send(resp);
            client.end();
            console.log('1) responded to request for sensor graph');
        }
    });
});

// respond to requests for /aameetings
app.get('/aameetings', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);
    
    // SQL query 
    var thisQuery = `
        SELECT newAddress AS address,
               title as location,
               lat,
               long,
               json_agg(
                   json_build_object(
                       'day', day,
                       'startTime', startTime,
                       'endTime', endTime,
                       'wheelc', wheelc,
                       'meetingtype', meetingtype,
                       'details', details
                    )
                ) as meetings
        FROM aalocations1
        GROUP BY newAddress, title, lat, long
    `;
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
    
   // AWS DynamoDB credentials
    AWS.config = new AWS.Config();
    AWS.config.accessKeyId = process.env.AWS_ID;
    AWS.config.secretAccessKey = process.env.AWS_KEY;
    AWS.config.region = "us-east-2";

    // Connect to the AWS DynamoDB database
    var dynamodb = new AWS.DynamoDB();
    
    // DynamoDB (NoSQL) query
    var params = {
        TableName: "deardiarylast",
        // KeyConditionExpression: "#dt = :dt", // the query expression
        KeyConditionExpression: "pk = :pk and #dt between :minDate and :maxDate", // the query expression
        ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
            "#dt": "date"
        },
        ExpressionAttributeValues: { // the query values
        ":pk": {S: "entry"},
        ":minDate": {N: new Date("Thu Nov 1 2018").valueOf().toString()},
        ":maxDate": {N: new Date("Fri Nov 30 2018").valueOf().toString()}
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

var s3x = `<!DOCTYPE html>
    <head>
        <title></title>
        <link rel="stylesheet" type="text/css" href="style.css">
        <script src="https://d3js.org/d3.v5.min.js"></script>
    </head>
    <body>
        <h2></h2>
        <script type="text/javascript" src="script.js">
        </script>
    </body>
<script>

var data = `;
var s4x = `; 
 var svg = d3.select('body').selectAll('.day')  
    .data(data)
    .enter()
    .append('div')
    .attr('class', 'day')
    .attr('style', (d) => {
        return "background-image: url(" + d.photo.S + ")"
    })
    .append("h2")
    .html('Title');
</script>`;

var myData = [];

// respond to requests for /deardiary
app.get('/dd', function(req, res) {
    
//   // AWS DynamoDB credentials
//     AWS.config = new AWS.Config();
//     AWS.config.accessKeyId = process.env.AWS_ID;
//     AWS.config.secretAccessKey = process.env.AWS_KEY;
//     AWS.config.region = "us-east-2";

    // Connect to the AWS DynamoDB database
    var dynamodb = new AWS.DynamoDB();
    
    // DynamoDB (NoSQL) query
    var params = {
        TableName: "deardiarylast",
        // KeyConditionExpression: "#dt = :dt", // the query expression
        KeyConditionExpression: "pk = :pk and #dt between :minDate and :maxDate", // the query expression
        ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
            "#dt": "date"
        },
        ExpressionAttributeValues: { // the query values
        ":pk": {S: "entry"},
        ":minDate": {N: new Date("Thu Nov 1 2018").valueOf().toString()},
        ":maxDate": {N: new Date("Fri Nov 30 2018").valueOf().toString()}
        }
    };

    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
            // var resp = s3x + JSON.stringify(qres.rows) + s4x;
            // res.send(resp);
            // client.end();
            // // res.send(data.Items);
            // console.log('3) responded to request for dear diary data');
            
            var resp = s3x + JSON.stringify(myData) + s4x;
            console.log(resp)
            res.send(resp);
            console.log('3) responded to request for dear diary data');
        }
    });
});

// create templates
var hx = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>AA Meetings</title>
  <meta name="description" content="Meetings of AA in Manhattan">
  <meta name="Mikaela Ergas Lenett" content="AA">
  //<link rel="stylesheet" href="css/styles.css?v=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.4/dist/leaflet.css"
   integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
   crossorigin=""/>
    <style>
            #mapid {
                height: 600px;
                width: 800px;
                align: center;
                // float: left;
                display: inline-block;
                position: absolute;
                top:0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
            }
       </style>
</head>
<body>
<div id="mapid"></div>
  <script src="https://unpkg.com/leaflet@1.3.4/dist/leaflet.js"
   integrity="sha512-nMMmRyTVoLYqjP9hrbed9S+FzjZHW5gY1TWCHA5ckwXZBadntCNs8kEqAWdrb9O7rxbCaA4lKTIWjDXZxflOcA=="
   crossorigin=""></script>
  <script>
  var data = 
  `;
  
const aaOutput = (d) => {
};
 
    var jx = `;
    var mymap = L.map('mapid').setView([40.734636,-73.994997], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        // accessToken: 'your.mapbox.access.token'
        accessToken: 'pk.eyJ1Ijoidm9ucmFtc3kiLCJhIjoiY2pveGF0aDV2MjIyOTNsbWxlb2hhMmR4dCJ9.JJdYD_jWgRwUeJkDWiBz3w'
    }).addTo(mymap);
    for (var i=0; i<data.length; i++) {
        L.marker( [data[i].lat, data[i].lon] ).bindPopup(JSON.stringify(data[i].meetings)).addTo(mymap);
    }
    </script>
    </body>
    </html>`;
    
// respond to requests for /aameetings
app.get('/aa', function(req, res) {
    var now = moment.tz(Date.now(), "America/New_York"); 
    var dayy = now.day().toString(); 
    var hourr = now.hour().toString(); 
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);
    
   
    var thisQuery = `
        SELECT newAddress AS address,
               title as location,
               lat,
               long as lon,
               json_agg(
                   json_build_object(
                       'day', day,
                       'startTime', startTime,
                       'endTime', endTime,
                       'wheelc', wheelc,
                       'meetingType', meetingtype,
                       'details', details
                    )
                ) as meetings
        FROM aalocations1
        GROUP BY newAddress, title, lat, lon
    `;
    client.query(thisQuery, (qerr, qres) => {
        if (qerr) { throw qerr }
        
        else {
            
            const rows = qres.rows.map(k => {
                k.output = aaOutput(k);
                return k;
            });
            
            var resp = hx + JSON.stringify(rows) + jx;
            res.send(resp);
            client.end();
            console.log('2) responded to request for aa meeting data');
        }
    });
});

// serve static files in /public
app.use(express.static('public'));

// listen on port 8080
app.listen(8080, function() {
    console.log('Server listening...');
});