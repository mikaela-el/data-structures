var diaryEntries = [];
var async = require('async'); // npm install async

class DiaryEntry {
  constructor(date, narrative, photo, video, music, article) {
    this.dt = {}; 
    this.dt.S = new Date(date).toDateString();
    this.narrative = {};
    this.narrative.S = narrative;
    this.photo = {};
    this.photo.S = photo;
    this.video = {};
    this.video.S = video;
    this.music = {};
    this.music.S = music;
    this.article = {};
    this.article.S = article;
  }
}

diaryEntries.push(new DiaryEntry('October 15 2018', "I am sad because it's raining", "https://66.media.tumblr.com/62fecee2625aae09b0485f0c022a4dcb/tumblr_ono1b1rlvM1tcqhjho1_500.png", "https://www.youtube.com/watch?v=wmxDZeh8W34", "Palto Alto by Devonte Hynes", "https://www.manrepeller.com/2017/10/how-to-make-rain-boots-look-cool.html"));
diaryEntries.push(new DiaryEntry('October 16 2018', "My horoscope said today will be a good day", "https://video-images.vice.com/_uncategorized/1539244096452-35-A-Rodchenko-and-V-Stepanova-descending-from-the-airplane-1926-Rodchenko-and-Stepanova-Archives-Moscow.jpeg?resize=1575:*", "https://www.youtube.com/watch?v=O7YYI8HFT40",  "Oblivion by Grimes", "http://www.oystermag.com/2018/09/life-lessons-from-cher-horowitz/"));
diaryEntries.push(new DiaryEntry('October 17 2018', "I am feeling very nostalgic and miss home", "https://video-images.vice.com/_uncategorized/1536241840958-c-Mario-Sorrenti-3-GENERAL-PRESS-IMAGE.jpeg?resize=1575:*", "https://www.youtube.com/watch?v=LNbl4wFCu_w", "Robson Girl by Mac Demarco", "https://i-d.vice.com/en_us/article/9k783e/theres-now-a-stranger-things-halloween-album"));
diaryEntries.push(new DiaryEntry('October 18 2018', "I am stressed about my quantitative methods midterm", "https://manrepeller-wpengine.netdna-ssl.com/wp-content/uploads/2016/08/what-do-dreams-mean-man-repeller-oct-2018-edit.jpg", "https://www.youtube.com/watch?v=ML9MIqivZRE", "On My Mind by Jorja Smith", "https://www.manrepeller.com/2018/10/4-native-people-on-indigenous-peoples-day.html"));

console.log(diaryEntries); 

//part 3
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-2";

var dynamodb = new AWS.DynamoDB();

async.eachSeries(diaryEntries, function(value, callback) {

var params = {};
params.Item = value; 
params.TableName = "deardiarydate";

dynamodb.putItem(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
})
setTimeout(callback, 500);
});





