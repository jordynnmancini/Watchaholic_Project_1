const searchTitleForm = document.querySelector("#title-form");
const titleInputEl = document.querySelector("#title-input");
const streamingResultsEl = document.querySelector("#streaming-results-container");
const streamingResultsList = document.querySelector("#streaming-list"); 

const apiKey = '';

let formSubmitHandler = function (event) {
    event.preventDefault(); 

    var title = titleInputEl.value.trim();

    if (title) {
        runSearchAPI(title);

    }
}

let runSearchAPI = function (title) {
    let searchURL = 'https://api.watchmode.com/v1/search/?apiKey=' + apiKey + '&search_field=name&search_value=' + title

    fetch(searchURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
        // locate ID and put into a variable 
            let movieID = data.title_results[0].id
            runTitleAPI(movieID); 
        });
      } else {
        alert('Error');
      }
    })
    .catch(function (error) {
      alert('Unable to locate Movie Title.');
    });
};

let runTitleAPI = function (movieID) {
    let titleURL = 'https://api.watchmode.com/v1/title/' + movieID + '/details/?apiKey=' + apiKey + "&regions=US&append_to_response=sources"

    fetch(titleURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          // render urls for user to access movie on screen 
          for (i=0; i < data.sources.length; i++) {
            let link = data.sources[i].web_url; 
            let li = document.createElement("li"); 
            li.textContent = link; 
            if (data.sources[i].type === "sub") {
            streamingResultsEl.appendChild(li); 
            }
          }
        
        });
      } else {
        alert('Error');
      }
    })
    .catch(function (error) {
      alert('Unable to locate Movie Title.');
    });


};


runSearchAPI(" "); 