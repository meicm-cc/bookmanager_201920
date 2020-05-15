const Agenda = require('agenda');
const db = require('./database.js');
const goodReads = require('./good_reads.js')

const SERVICE_DB_HOSTNAME = encodeURIComponent(process.env.SERVICE_DB_HOSTNAME || 'localhost')
const SERVICE_DB_PORT = encodeURIComponent(process.env.SERVICE_DB_PORT || 27017)
const SERVICE_DB_NAME = process.env.SERVICE_DB_NAME || 'bookmanager'

const url = `mongodb://${SERVICE_DB_HOSTNAME}:${SERVICE_DB_PORT}/${SERVICE_DB_NAME}`;

const start = async (mongo) => {
  const agenda = new Agenda({ db: { address: url, collection: 'agendaJobs' }, options: { useNewUrlParser: true } });

  agenda.define('gather data', async (job, done) => {

    console.log('[AGENDA] starting job - gather data');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get keywords
    const trackedBooks = await db.getBooks(mongo.db);

    console.log(`[AGENDA|DG] got ${trackedBooks.length} books to track`);
    const statistics = {
      date: today,
      trackedBooks: trackedBooks.length,
      ratings: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      },
      publishers: {},
      deltas: {
        day: 0,
        week: 0,
        month: 0
      }
    }

    // For Each Book
    for (let book of trackedBooks) {
      let bookData = await goodReads.getBookData(book.id);
      console.log(bookData);
      // Add Ratings
      let ratingGroup = Math.ceil(bookData.avg_rating);
      console.log(ratingGroup);
      statistics.ratings[ratingGroup]++;

      // Add Publishers
      if (!statistics.publishers[bookData.publisher]) {
        statistics.publishers[bookData.publisher] = {
          totalBooks: 0,
        }
      }
      statistics.publishers[bookData.publisher].totalBooks++;
    }


    // Calculate Statistics
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    let yesterdayStats = await db.getStatisticsByDay(mongo.db, yesterday);
    if (yesterdayStats) {
      statistics.deltas.day = (statistics.trackedBooks - yesterdayStats.trackedBooks) / yesterdayStats.trackedBooks;
    }

    let lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    lastWeek.setHours(0, 0, 0, 0);

    let lastWeekStats = await db.getStatisticsByDay(mongo.db, lastWeek);
    if (lastWeekStats) {
      statistics.deltas.week = (statistics.trackedBooks - lastWeekStats.trackedBooks) / lastWeekStats.trackedBooks;
    }

    let lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 30);
    lastMonth.setHours(0, 0, 0, 0);

    let lastMonthStats = await db.getStatisticsByDay(mongo.db, lastMonth);
    if (lastMonthStats) {
      statistics.deltas.month = (statistics.trackedBooks - lastMonthStats.trackedBooks) / lastMonthStats.trackedBooks;
    }

    console.log(statistics);

    let statResults = await db.insertStatistics(mongo.db, statistics);

    console.log('[AGENDA!GD] processed deltas');
    console.log('[AGENDA] ended job - gather data');
    return done(null, true);
  });

  console.log('Starting Agenda');
  await agenda.start();

  console.log('[Agenda] defining schedules');
  await agenda.every('0 6 * * *', 'gather data');

  let stats = await db.getLatestStatistic(mongo.db);
  let books = await db.getBooks(mongo.db);
  if (!stats && books && books.length > 1) {
    await agenda.now('gather data');
  }
}

module.exports = {
  start: start,
  trigger: () => {
    const agenda = new Agenda({ db: { address: url, collection: 'agendaJobs' }, options: { useNewUrlParser: true } });
    agenda.on("ready", () => {
      agenda.start()
      agenda.now('gather data');
    });
  }
}
