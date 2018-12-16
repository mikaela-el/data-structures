## Final Assignment Documentation 

### Assignment #1: AA Meetings

##### For first final assignment, we were required to scrape data from New York’s AA Meeting list and then clean, store and visually represent the data on a map. In the first week, I used Node.js to make a request for the 10 different zones from the “Meeting List Agenda”, specifically for Manhattan. Once the files were saved, I extracted the data and stored the contents of one of the zones in a variable. We were each assigned a single zone to scrape and clean the data, which would then be shared with other classmates to complete all ten zones. In this stage, I sketched out my data structure which is represented by the data model below. However, as the project evolved, the data model did as well. 

![image](aameetingdatamodel.png)

##### Once I was finished parsing the data from the single zone, I made a request to the Texas A&M Geoservices Geocoding API’s for each address within that zone. Due to the messy nature of the addresses that were returned, I needed to parse the code to make it ready for the API queries. For example, some of the addresses did not have street names or included a range of street numbers which would not return a latitude or longitude. 

##### Using the AWS RDS Postgres database, I created a table to store the locations from the AA Meeting data. Once the table was created, I used the pg module to insert the data and populate my database. I then wrote and executed a query to filter the meetings on Thursdays and Fridays that start at 5:00pm. 

![image](finalAAquery.png)

##### Through collaborating with other classmates, I was able to parse and clean the data from all ten zones and input that data into a JSON file. My final query looked like this:

![image](AAquery.png)

##### For the visual representation, I used leaflet to bind the data points onto a map of Manhattan.  I included imagery of other maps that i took incpiration from and wanted to include within my design. However, due to a lack of time, I did not get to implement my design ideas. My final map included a marker pop up for each location which displays the data from the query. In the future, I would like to go back and style the text within the popup to not be in a JSON format. Ideally, I would also like to be able to have the user filter the popup markers by meeting time and type.

![image](aameetinginspo.png)

### Assignment #2: Dear Diary 

##### For our second final assignment, we were asked to create a “diary” where we collected data on a daily basis and inputted the data into a table, which we would then visually represent. My idea for my diary came from the realization that every day I was bookmarking multiple websites that interested me however, would never go back and re-visit these websites. After gathering hundres of URL's within my bookmark manager, I realized I needed a way to catagorize these links and sort them for future use. Thus, my dear diary project would act as a “catalogue”, holding all the media that I found interesting on that specific day in the form of a calendar. Acting as both a visual and textual diary, the calendar would combine various mediums such as text, image, video and music, to represent how I was feeling that day.  

##### Each day within the month of November, I wrote one piece of text that described my “mood” and then accompanied it with a song, news article, image and video. Due to the fact that I was collecting data in various mediums such as photos and videos, I chose to create a NoSQL database using Amazon DynamoDB. To create this database, I first sketched a normalized data model for my table which can be seen below. I started with my primary key, which then lead to “date” and below each date was the various forms of media associated with that day. 

![image](ddDataModel.png)

##### Throughout the process of creating the data model, I realized the importance of having a conceptual idea of the visualization before structuring the model. Thus, during the process of creating the model, I also sketched out the visual interface of the data which can be seen below. The landing page is simply a calendar of November and the background of each day is represented by the image that was chosen on that specific day. I also wanted the user to be able to click on that day and be lead to another blog style page. Each day would have a unique blog post that would incorporate the various links and visually represent them. For example, If a user clicked on November 3rd, they would see an image from that day as well as text and the music would play in the background of the page. Through combining text, image and sound, I wanted to be able to accurately communicate how I was feeling to a randoms stranger on any particular day of the month.  

![image](ddSketch.png)

##### It is important to point out that as I began querying my data and thinking of the visualization, I chose to change my data model, specifically the number of mediums I was representing as well as the primary and sort keys. I originally did not want to include all five mediums everyday however, as I was writing the code to insert my data into the table, I realized that having the mediums be consistent throughout the month would help with simplicity. After creating the data model, I then created a table in Dynamo DB with a specific primary key as well as a sort key which would be later used to organize the output of my table. The table was structured with a primary key being “pk” which I called “entry”. I then decided to use the date as my sort key because I wanted to sort through all of my diary entries and arrange them by the day of the month. Due to the fact that all of the mediums resided on the same level within the data model, I did not create a strict hierarchy within the different mediums.

![image](ddTable.png)

##### In order to give each item a value and store them in an array, I used the “putItem” method in AWS SDK for JavaScript in Node.js. I then used AWS SDK to populate the database with the data I had collected throughout the past month. Once the database was populated, I wrote and executed a query based on the information I wanted to visualize. I wanted to filter through my diary entries by date because I knew my final visualization would look like a calendar which heavily relies on date as the sorting factor. I decided to write a NoSQL query that would provide me with a range of data between November 1st and November 30th. I found this query to be efficient at giving me only the values between those specific days however, it did not sort the values from the start of the month to the end of the month. 

![image](ddquery.png)

##### When binding the data to the visual representation, I made the decision to include all of the information however, to not visually represent every data point. For example, I visually represented the photo  by converting the links into actual images for the background of the calendar. Although I had the intention of doing the same thing with the videos, I did not have time to execute this idea. Thus, I simply kept the rest of the data in a textual format. Due to a lack of time, I was unable to bind every data point to the visualization. Ideally, I would have liked to be able to hover over the image and display all of the data points. I was also unable to create the visualization using dynamic data and simply used static data that I put into a separate JSON file. If I were to continue this project in the future, I would want to continue collecting data every day and simply create more monthly calendar spreads for an entire year. 

![image](ddDataOutput.png)

### Assignment #3: Light Sensor

##### For the third final assignment, we were asked to generate data over the course of a four-week period using a specific sensor and then visualize the information we collected. The sensor I chose to work with was a photoresistor which measured the intensity of light. I placed the photoresistor in my studio apartment to see the intensity of light at various times of the day, including when I was asleep. I was specifically interested in looking at the values during the nighttime because I wanted to see how often I woke up in the middle of the night and how often i was on my computer or phone. However, as the project evolved, I realized that the sensor was picking up on other interesting trends, such as the time I woke up in the morning and the time of sunset. 

##### In order to read the brightness levels of the sensor, I first registered a Particle variable with the cloud. I then wrote a loop to see the value of the sensor which would then store that value in a variable. Using a starter code provided in combination with Web IDE, I was able to see the values of the sensor throughout the testing period. I then set up a single variable in a string which included the value of my sensor. This value was accessible through a URL I created that retrained the JSON data from the Particle cloud API. 

##### My original sketch for the visualization represented the average intensity of light for every hour of the day for 14 days.  The days were represented on the x axis and the hours of the day on the y axis. Each circle represented an hour of the day and the color of the circle ranged depending on the value collected. I originally wrote a query to receive this specific data however, in the end I chose to only visualize the average of every hour over the entire collection period. I decided to change the query because I did not have enough time to build out the visualization using this data. 

![image](sensorquery.png)

##### In the future I hope to build my original sketch and change the query back to retreiving the average of the hour of each day. The final interface design of my sensor data was represented as a bar chart with the hour of the day on the x axis and the value of the intensity of light on the y axis. As the user hovers over the bars, they are able to view the value of the intensity of light. It is important to point out that the time on the x axis is not correlated to the common 24 hour clock. While i did not know how to change the time to represent the "real-time", I noticed that the values seemed to be approximately 5 hours behind. I realized this because on the bar chart the lowest levels of light occur around 7am however, I am almost always awake at this time. Thus, I beleive the hours are reffering to a different scale of time. 

![image](sensorsketch.png)



