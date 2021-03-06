// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');
var m06Address = '';

// load the m06 text file into a variable, `content`
var content = fs.readFileSync('../Week1Assignment/data/m06.txt'); //goes up to the directory 'data structures', then back down to data, then to m05

// load `content` into a cheerio object
var $ = cheerio.load(content);

// print (to the console) names of addresses
$('td').each(function(i, elem) { // "each" is a loop  // all the addresses were in tables 
    //console.log($(elem).attr("style"));
    //console.log('***************************************');
    if ($(elem).attr("style") == 'border-bottom:1px solid #e3e3e3; width:260px') {
        //console.log($(elem).html().split('<br>')[2].trim().split(',')[0])
        m06Address += ($(elem).html().split('<br>')[2].trim().split(',')[0]) + '\n'; 
    }
});


// write the addresses to a text file
//var m06Address = ''; // this variable will hold the lines of text
 
fs.writeFileSync('m06Address.txt', m06Address);