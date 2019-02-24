# engJour
initially clone the schedule repo clone to laptop.

earlier database was connected mongo db atlas since for this project we working with mostly local database rather then any managed services i changed from online version to local mongodb.

## 02/02/2019

date && node --stack_size=8192 --max-old-space-size=8192 fakerData.js && date

now with running locally mongodb on my laptop and with seed script it's running component services as expected.

now to test 10m records with mongodb just to see without any tuning. 

I used faker to generate fake data with exact same schema that used in actual production and just some randomness of data.

I created separate  seed scripts just for mongodb to insert fake data in to fakeDB as attached here in repo.

I started loading 100K records with it and it was doing just under 1 minute.

Next step was i created for loop that generate around 100K times random data and put into array that seeds into mongodb and it was working as expected.

now when i tried to increase loop from 100K to 200K to increase seeds suddenly start errors out 
there was 2 errors mostly i got during this entire process 
1) javascript head memory issues where it's running out of memory.
2) mongo connection timeout.

after some research I found right balance with all those numbers without any breaking stuff and to run this asynchronously i also running that seeds script along with bash script that runs multiple times.

I was able to generate 6M records in an hour, it can also insert 10M records but that not in an hour.

I think there is some issues with mongo connection opening and close where if i can tune it, it might reduce insertion time but i am leaving as it is since I just wanted to test as it was given 


## 02/04/2019 

currently working on refactoring code from using mongodb to mySQL
database schema has been changed and created two seperate table since other DB has nested json object 
working on re-write API endpoint to server data to react 

    mysql> SET GLOBAL max_allowed_packet=1073741824;

the challenge was schema design where we have nested json object in mongo since relational DB doesn't support that i was earlier doing join with two seperate tables but that create another challenge about how i can merge two table's data into single API without refactoring too much client code.
then talking to Joe (who developed this component) and give me some valuable informatino about how those nested strcture utilizing in to code, so i redesign schema and put all into single table with very little re-factor on react i was able to achieve same application output with mongo. 

Next step to create fake data with faker and generate 10m records, i have attached scripted that i used to generate almost 11m records in 7min and 44sec with for loop that push into array and knex inserted those data into mySQL and on top of it running bash script to run this process multiple times.

some other benchmark :
from mysql : select * from fakertable order by RAND() limit 1;   - it took around 28s
select * from fakertable where id=54520;  - search specific records took around 7s ( it took longer becuase there were 400000 records matching with same id )


## 02/05/2019 

i have started working with cassandra for NoSQL database for schedule component, initial repo setup, installation of cassandra was little tricky since you have to install out side of node, i downloaded .tar.gz binary for macos, and install locally on my machine.

configuration was easy, there were few key difference between compare to MySQL eventhough it's NoSQL you still have to desing schema almost same as MySQL but instead of document it's column based keystore where everything defined as keyspace.

created keyspace and table, then created seed script for insertation of data.

modify express API routes and app finally working as expected.


## 02/07/2019

Now next step is to generete 10m records in cassandra for benchmarking.
cassandra is little stangant about schema and how you insert records into DB, initially i was researching about dsbulk tool (datastax bulk loader) to insert bulk load of data but couldn't find much documentation on it.
next thing i found you can also import data through JSON or CSV format as batch loading 
the question was how we can generate programatically 10m records of CSV data, there are some tools available to generate csv file along with faker that can generate format you want.
i was just using bash scripting along with VI editor to generate 10m records into CSV and the COPY command to insert in to cassandra DB.

        cqlsh> copy faker.fakertable  from 'export.csv' with header=true;

it loading 10m records in 3min 54 sec. 

i still have to figure it out to automate every process.

## 02/11/2019 

finally i was able to figure it out how i can automate the entire process that generate CSV file and insert into cassandra.
The way i did it in specific steps 
1) create fake db schema files and import in cassandra 
2) create headers ( that includes all schema headers) and write in CSV file 
3) create 1m records using faker and append the csv file 
4) using COPY command to insert that csv file into cassandra 

i have to run 10 times that genereate 10m records and append into csv file - i used bash scripting for it 
so entire single command looks like this.

     date && node --max-old-space-size=25000 test.js && for i in `seq 1 10`;do node --max-old-space-size=29000 test1.js ;done      && cqlsh < test2.js && date 
     
and it took around 22min and 26sec to run this 

## 02/13/2019

today i tried another database postgres though it's kind of same as mysql i wanted to try out and see how it perform.
initially created same schedule as mysql,created db and table and insert sample data into db.
also changed on express how it's fetching data from postgres and it's working fine with postgres 

next challenge was to insert 10m records and i am still working on it 

## 02/16/2019

today i run some performance test on deployed version of my component services on EC2 where i have client and database on same instance. 
i used loader.io to run some benchmarking for RPS 
just for my service i got right balance for 2500 clients per minuute with 8ms latency and almost 0% error rate.
there are also few test i have done with 100, 1k, 2k clients.

    250 clients per minute 
![image](https://user-images.githubusercontent.com/12757041/52917341-d5d9d800-32af-11e9-9175-ecfd367025f6.png)

    1k clients per minute 
![image](https://user-images.githubusercontent.com/12757041/52917385-5b5d8800-32b0-11e9-9d2a-177031c403d6.png)

    2k clients per minute 
![image](https://user-images.githubusercontent.com/12757041/52917438-23a31000-32b1-11e9-8d53-07ee283a6672.png)

    3k clients per minute 
![image](https://user-images.githubusercontent.com/12757041/52917510-fc990e00-32b1-11e9-8a49-262ee283c272.png)

    2.5k clients per minute 
![image](https://user-images.githubusercontent.com/12757041/52917529-2e11d980-32b2-11e9-8151-9af9259d7f8b.png)

## 02/19/2019
i have deployed today separate client and mysql DB instances in AWS.
the process was smooth only challange i face during configuration of making DB connection from client where you have to connect using their public IP.
there was another issues that you can't connected directly to mySQL root account from remote machine so i have create separate user for that.
and also make sure security groups allow permission from client to mySQL DB instance on port 3306 

## 02/20/2019
Today i run some benchmarking on deployed version in EC2 and tried to insert 10m records but it was too slow 
took around 1 hour and 30min to run on mysql 
after few tweeks and tunning i was able to insert 10m records in 36min 
things i have change is increase storage disk space + also added provision IOPS disk instead of general purpose 

        newrelic dashboard for service running locally 
        
![image](https://user-images.githubusercontent.com/12757041/53200456-31c19b00-35e7-11e9-8654-808d5515410b.png)

        artillery test for service running locally 
![image](https://user-images.githubusercontent.com/12757041/53200593-86651600-35e7-11e9-9f92-25fc1cbb4f68.png)

##02/23/2019
Today i have setup ELB ( elastic load balancer) in AWS where it's serve traffic for my service component 
that's been part of launch confiugration and auto scalling group in AWS
i have been using ELB in past so configuration and setup was easy.
i have to create AMI ( amazon machine image ) for my service component and create LC using that AMI and also confiure ASG using that LC.
Initially i started with 2 instances where also desired capacity also 2 instances so anytime 2 instances will be running.
then i started doing loaderio test for my serivces 

        2.5k client per minute 
 ![image](https://user-images.githubusercontent.com/12757041/53303424-c3234e00-382f-11e9-9de3-53bb314776a1.png)

as you can see response time is drastically reduced from using single instance to ELB + 2 instances ( 8ms to 3ms) 
        
        3k clients per minute
        
![image](https://user-images.githubusercontent.com/12757041/53303469-362cc480-3830-11e9-8187-0543c837e9a4.png)

