# engJour
initially clone the schedule repo clone to laptop.

earlier database was connected mongo db atlas since for this project we working with mostly local database rather then any managed services i changed from online version to local mongodb.

###########################02/02/2019########################

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


##### 02/04/2019 
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


##### 02/05/2019 #######################

i have started working with cassandra for NoSQL database for schedule component, initial repo setup, installation of cassandra was little tricky since you have to install out side of node, i downloaded .tar.gz binary for macos, and install locally on my machine.

configuration was easy, there were few key difference between compare to MySQL eventhough it's NoSQL you still have to desing schema almost same as MySQL but instead of document it's column based keystore where everything defined as keyspace.

created keyspace and table, then created seed script for insertation of data.

modify express API routes and app finally working as expected.


####### 02/07/2019

Now next step is to generete 10m records in cassandra for benchmarking.
cassandra is little stangant about schema and how you insert records into DB, initially i was researching about dsbulk tool (datastax bulk loader) to insert bulk load of data but couldn't find much documentation on it.
next thing i found you can also import data through JSON or CSV format as batch loading 
the question was how we can generate programatically 10m records of CSV data, there are some tools available to generate csv file along with faker that can generate format you want.
i was just using bash scripting along with VI editor to generate 10m records into CSV and the COPY command to insert in to cassandra DB
 # cqlsh> copy faker.fakertable  from 'export.csv' with header=true;

it loading 10m records in 3min 54 sec. 

i still have to figure it out to automate every process.
