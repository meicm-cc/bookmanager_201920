const historyServiceURL = ''
const searchServiceURL = ''

const insertSearchResult = (book,table) => {
  let row = document.createElement('tr');
  let year = document.createElement('td');
  year.innerHTML = book.year;
  row.appendChild(year);
  let title = document.createElement('td');
  title.innerHTML = book.title;
  row.appendChild(title);
  let author = document.createElement('td');
  author.innerHTML = book.author;
  row.appendChild(author);
  let rating = document.createElement('td');
  rating.innerHTML = book.averageRating;
  row.appendChild(rating);
  let cover = document.createElement('td');
  let img = document.createElement('img');
  img.src = book.thumbnail_url;
  cover.appendChild(img)
  row.appendChild(cover);
  table.appendChild(row);
}

const insertHistoryResult = (result, tableResults, tableSearch) => {
  let tbodyResults = tableResults.querySelector('tbody');
  let row = document.createElement('tr');
  let date = document.createElement('td');
  date.innerHTML = moment(result.date).format('YYYY/MM/DD');
  row.appendChild(date);
  let terms = document.createElement('td');
  terms.innerHTML = result.query;
  row.appendChild(terms);
  let numberOfResults = document.createElement('td');
  numberOfResults.innerHTML = result.data.length;
  row.appendChild(numberOfResults);
  let buttonTD = document.createElement('td');
  let button = document.createElement('button');
  button.innerHTML = "Show";
  //button.setAttribute('data-index');
  button.addEventListener('click',(event)=>{
    event.preventDefault();
    let tbody = tableSearch.querySelector('tbody');
    tbody.innerHTML = '';
    for(let book of result.data){
      insertSearchResult(book,tbody);
    }
    tableSearch.style.display = 'block';
  });
  buttonTD.appendChild(button);
  row.appendChild(buttonTD);
  tbodyResults.appendChild(row);
}

const searchListener = (e) => {
  e.preventDefault();
  let searchTerms = document.querySelector("#search").value;
  
  axios.post(searchServiceURL+'/api/search',{search:searchTerms})
  .then(response => {
    console.log(response.data);
    let table = document.querySelector('#search_results');
    let tbody = table.querySelector('tbody');
    tbody.innerHTML = '';
    for(let book of response.data){
      insertSearchResult(book,tbody);
    }
    table.style.display = 'block';
  })
  .catch(error => {
    console.log(error)
  })
}

const populateHistory = async () => {
  let historyResults = await axios.get(historyServiceURL+'/api/history');
  if(historyResults){
    let tableResults = document.querySelector('#history_table');
    let tableSearch = document.querySelector('#search_results');
    for(let result of historyResults.data){
      insertHistoryResult(result,tableResults,tableSearch);
    }
  }
}

(()=>{
  console.log("JS Loaded");
 
  let search_form = document.querySelector("#search_form");
  if(search_form){
    search_form.addEventListener('submit',searchListener);
  }

  let history_results = document.querySelector('#history_table');
  if(history_results){
    populateHistory();
  }

})();
