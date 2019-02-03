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




