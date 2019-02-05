/* eslint-disable import/newline-after-import */
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fakedb');
const faker = require('faker');
const db = mongoose.connection;
mongoose.Promise = global.Promise;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('MongoDB is connected to the Schedules database');
});

const scheduleSchema = {
  id: { type: Number },
  vs: String,
  city: String,
  team: String,
  teamlogo: String,
  week: Number,
  date: String,
  opponent: String,
  opponentlogo: String,
  result: String,
  winloss: String,
  wl: String,
  link: String,
  stats: {
    playerpass: String,
    playerrush: String,
    playerrec: String,
    pass: Number,
    rush: Number,
    rec: Number,
  },
  feed: String,
};

const scheduledbfaker = mongoose.model('Schedule', scheduleSchema);


const ramSchedule = {
  id: faker.random.number(),
  vs: 'vs',
  city: faker.address.city(),
  team: faker.random.word(),
  teamlogo: faker.image.abstract(),
  week: 1,
  date: faker.date.future(),
  opponent: faker.random.word(),
  opponentlogo: faker.image.abstract(),
  result: faker.random.number(),
  winloss: faker.random.number(),
  wl: faker.random.alphaNumeric(),
  link: faker.internet.url(),
  stats: {
    playerpass: faker.random.word(),
    playerrush: faker.random.word(),
    playerrec: faker.random.word(),
    pass: faker.random.number(),
    rush: faker.random.number(),
    rec: faker.random.number(),
  },
  feed: faker.random.words(10),
};
// eslint-disable-next-line no-multiple-empty-lines

const finaldata = [];
// eslint-disable-next-line no-plusplus
for (let i = 0; i < 150000; i++) {
  finaldata.push(ramSchedule);
}



console.log('this is final lenght of data', finaldata.length);

// eslint-disable-next-line func-names
const insertFakeData = function () {
  scheduledbfaker.create(finaldata)
    .then(() => db.close());
};
insertFakeData();
