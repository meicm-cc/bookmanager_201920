var historyServiceURL = 'http://api.bookmanager.meicm'
var searchServiceURL = 'http://api.bookmanager.meicm'
var authenticationServiceURL = 'http://api.bookmanager.meicm'
var trackingServiceURL = 'http://api.bookmanager.meicm'
var dataGathererServiceURL = 'http://api.bookmanager.meicm'
var statisticsServiceURL = 'http://api.bookmanager.meicm'

const processRatings = (data) => {
  const processed = {
    ratings: Object.keys(data),
    datasets: []
  }
  for (let rating of processed.ratings) {
    processed.datasets.push({
      label: rating,
      data: [data[rating]],
      backgroundColor: 'red'
    });
  }
  return processed;
}

const processTimeData = (data) => {
  data.reverse();
  const processed = {
    datasets: [{
      data: [],
      label: 'Books',
      backgroundColor: 'red',
      type: 'line',
      fill: false
    }]
  }
  for (let stat of data) {
    processed.datasets[0].data.push({
      t: new Date(stat.date).valueOf(),
      y: [stat.totalBooks]
    });
  }
  return processed;
}

const chartColors = [
	'rgb(255, 99, 132)',
	'rgb(255, 159, 64)',
	'rgb(255, 205, 86)',
	'rgb(75, 192, 192)',
	'rgb(54, 162, 235)',
	'rgb(153, 102, 255)',
  'rgb(201, 203, 207)',
  'rgb(25, 99, 132)',
	'rgb(25, 159, 64)',
	'rgb(25, 205, 86)',
	'rgb(7, 192, 192)',
	'rgb(5, 162, 235)',
	'rgb(13, 102, 255)',
  'rgb(21, 203, 207)',
  'rgb(255, 99, 12)',
	'rgb(255, 159, 4)',
	'rgb(255, 205, 6)',
	'rgb(75, 192, 12)',
	'rgb(54, 162, 25)',
	'rgb(153, 102, 55)',
  'rgb(201, 203, 07)',
  'rgb(25, 99, 13)',
	'rgb(25, 159, 6)',
	'rgb(25, 205, 8)',
	'rgb(7, 192, 19)',
	'rgb(5, 162, 25)',
	'rgb(13, 102, 25)',
	'rgb(21, 203, 27)'
];

const  getRandomInt= (max) => {
  return Math.floor(Math.random() * Math.floor(max));
}

const processPieData = (publishers) => {

  const data = {
    datasets: [{
      data: [],
      backgroundColor: [],
      label: 'Publishers'
    }],
    labels: []
  }
  for(let publisher of Object.keys(publishers)){
    data.datasets[0].data.push(publishers[publisher].totalBooks);
    data.datasets[0].backgroundColor.push(chartColors[getRandomInt(chartColors.length)]);
    data.labels.push(publisher);
  }
  return data;
}

const layoutBookList = async () => {
  const books = (await axios.get(trackingServiceURL+'/api/books')).data;
  const tbody = document.querySelector('.book_list tbody');
  tbody.innerHTML = '';
  for (let book of books) {
    let tr = document.createElement('tr');
    let tdCover = document.createElement('td');
    let tdLink = document.createElement('td');
    let tdButton = document.createElement('td');
    let cover = document.createElement('img');
    let link = document.createElement('a');
    let button = document.createElement('button');
    cover.src = book.thumbnail_url;
    link.href = book.url;
    link.innerHTML = book.title;
    button.innerHTML = 'Delete';
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      let result  = await axios.delete(trackingServiceURL+'/api/books/'+book.id);
      console.log(result);
      alert("Book Tracking Deleted");
      layoutBookList();
    })
    tdCover.appendChild(cover);
    tdLink.appendChild(link);
    tdButton.appendChild(button);
    tr.appendChild(tdCover);
    tr.appendChild(tdLink);
    tr.appendChild(tdButton);
    tbody.appendChild(tr);
  }
}

(async () => {

  let token = sessionStorage.getItem('token');
  if(token){
    axios.defaults.headers.common['Authorization'] = 'bearer '+ token;
  } else {
    return location.href='auth.html';
  }

  const button = document.querySelector("#trigger");
  if (button) {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      console.log(await axios(dataGathererServiceURL+'/api/trigger'));
    })
  }


  const books = (await axios.get(trackingServiceURL+'/api/books')).data;
  const statistics = (await axios.get(statisticsServiceURL+'/api/statistics')).data;
  const latestStatistic = (await axios.get(statisticsServiceURL+'/api/statistics/latest')).data;
  document.querySelector('.books div').innerHTML = books.length;
  if (!latestStatistic) return;
  document.querySelector('.growth :nth-child(2) span').innerHTML = (latestStatistic.deltas.day * 100).toFixed(2);
  document.querySelector('.growth :nth-child(3) span').innerHTML = (latestStatistic.deltas.week * 100).toFixed(2);
  document.querySelector('.growth :nth-child(4) span').innerHTML = (latestStatistic.deltas.month * 100).toFixed(2);


  const keywordsCtx = document.querySelector("#ratings-chart");
  const processedData = processRatings(latestStatistic.ratings);
  const keywordsChart = new Chart(keywordsCtx, {
    type: 'bar',
    data: {
      labels: ['Books'],
      datasets: processedData.datasets,
    },
    options: {
      responsive: false,
      legend: { display: false },
      title: { display: true, text: 'Ratings' }
    }
  });

  const timeData = processTimeData(statistics);
  const totalJobsCtx = document.querySelector("#total_chart");
  const timeFormat = 'YYYY/MM/DD';
  const totalJobsChart = new Chart(totalJobsCtx, {
    type: 'line',
    data: timeData,
    options: {
      responsive: false,
      layout: { padding: { right: 8, left: 0 } },
      legend: { display: false },
      title: { display: true, text: "Tracked Books" },
      scales: {
        xAxes: [{
          type: 'time',
          distribuition: 'series',
          ticks: {
            source: 'data',
            autoSkip: true,
            display: false
          },
          scaleLabel: { display: false }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Books'
          }
        }]
      }
    }
  });

 

  const pieData = processPieData(latestStatistic.publishers);
  var config = {
    type: 'pie',
    data: pieData,
    options: {
      responsive: true
    }
  };
  const ctx = document.querySelector('#publishers-pie').getContext('2d');
	const publishersPie = new Chart(ctx, config);

  layoutBookList();

})();
