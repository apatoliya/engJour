const options = {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'faker',
    },
  };
  
  const faker = require('faker');
  
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
    playerpass: faker.random.word(),
    playerrush: faker.random.word(),
    playerrec: faker.random.word(),
    pass: faker.random.number(),
    rush: faker.random.number(),
    rec: faker.random.number(),
  };
  
  const finaldata = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 400000; i++) {
    finaldata.push(ramSchedule);
  }
  console.log('this is final length', finaldata.length);
  
  const knex = require('knex')(options);
  
  knex('fakertable').insert(finaldata).then(() => console.log('data inserted'))
    .catch((err) => { console.log(err); throw err; })
    .finally(() => {
      knex.destroy();
    });
  