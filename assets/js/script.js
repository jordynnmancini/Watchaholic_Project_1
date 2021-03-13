const searchTitleForm = document.querySelector("#title-form");
const titleInputEl = document.querySelector("#title-text");
const searchButton = document.querySelector("#click-me-button"); 
const streamingResultsEl = document.querySelector("#streaming-results-container");
const streamingResultsList = document.querySelector("#streaming-list");
const additionalList = document.querySelector("#additional-list");

const apiKeyMode = 'ElJhpK6QLVuPKeRrwmtqaJCiNO7HkABInA8EHQ0Q'
const apiKeyOMDB = "fdb6720d"
const apiKeyNYT = 'T6BXN6H37HkF7emcIuzQU36KKC95bSOE'

//poster & data from OMDB API 
$(".btn").on("click", function (event) {
  // Preventing the button from trying to submit the form......
event.preventDefault();

var title = $("#title-text").val().trim();

var requestUrl = "http://www.omdbapi.com/?t="+title+"&apikey="+ apiKeyOMDB;

fetch(requestUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data)
        // empty details div //
        $("#omdb-results-container").empty();
        // create elements and assign API info to the element //
        var titleEl = $("<h2>").text(data.Title);
        var yearEl = $("<p>").text("Year Released: " + data.Year);   
        var actorsEl = $("<p>").text("Actors: " + data.Actors);   
        var plotEl = $("<p>").text("Plot: " + data.Plot);   
        var ratedEl = $("<p>").text("Rated: " + data.Rated);   
        var ratingEl = $("<p>").text("IMDB Rating: " + data.imdbRating);
        var runtimeEl = $("<p>").text("Runtime: " + data.Runtime);
        var posterEl = $("<img>").attr("src", data.Poster);
        var genreEl = $("<p>").text("Genre: " + data.Genre);
        var awardsEl = $("<p>").text("Awards: " + data.Awards);
       

        // create div and append elements to div //
        var divFormat = $("<div>");
        divFormat.append(titleEl, posterEl, plotEl, actorsEl, yearEl, runtimeEl, genreEl, ratedEl, ratingEl, awardsEl);
        // set div to html //
        $("#omdb-results-container").html(divFormat);
    });
  });

// NYT Review data and link
$(".btn").on("click", function (event) {
  event.preventDefault();
  let title = $('#title-text').val().trim();
  console.log(title);

  // created URL for NYT API call
  const reviewURL = 'https://api.nytimes.com/svc/movies/v2/reviews/search.json?query=' + title + '&api-key=' + apiKeyNYT;
  console.log(reviewURL);

  // fetched data from NYT API
  fetch(reviewURL)
    .then(function(response){
      return response.json();
    })
    .then(function(data){
      console.log(data);

      // isolate review URL from json data
      const NYTReviewLink = data.results[0].link.url;
      console.log(NYTReviewLink);
      
      //create new review link element and div. set new div to html
      $('#nytreview-results-container').empty();
      let reviewEl = $('<a>').text('New York Times Review').attr({'href':NYTReviewLink, 'target':'_blank'});
      let NYTReviewDiv = $('<div>');
      reviewEl.addClass("btn"); 
      NYTReviewDiv.append(reviewEl);
      $('#nytreview-results-container').html(NYTReviewDiv);
    });
});


// streaming info from WatchMode API 

searchButton.addEventListener('click', formSubmitHandler); 

function formSubmitHandler (event) {
  event.preventDefault();
  var title = titleInputEl.value.trim();
  localStorage.setItem("last search", title); 

  if (title) {
    runSearchAPI(title);

  } 
}

let runSearchAPI = function (title) {
  streamingResultsEl.classList.remove("hidden"); 
  titleInputEl.value=""

  let searchURL = 'https://api.watchmode.com/v1/search/?apiKey=' + apiKeyMode + '&search_field=name&search_value=' + title

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
        console.log('Error');
      }
    })
    .catch(function (error) {
      console.log('Unable to locate Movie Title.');
    });
};

let runTitleAPI = function (movieID) {
  let titleURL = 'https://api.watchmode.com/v1/title/' + movieID + '/details/?apiKey=' + apiKeyMode + "&regions=US&append_to_response=sources"

  fetch(titleURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          // render buttons for popular streaming services available
          streamingResultsList.innerHTML=""
          additionalList.innerHTML="" 
          for (i = 0; i < data.sources.length; i++) {
            if (data.sources[i].type === "sub") {
              if (data.sources[i].source_id === 203) {
                let Netflix = document.createElement("a"); 
                let netflixLI = document.createElement("li"); 
                let netflixHref = data.sources[i].web_url
                Netflix.textContent = "Netflix"
                Netflix.setAttribute("href", netflixHref);
                Netflix.setAttribute("target", "_blank"); 
                netflixLI.appendChild(Netflix);
                netflixLI.classList.add("streaming-btn", "btn"); 
                streamingResultsList.appendChild(netflixLI); 
                
              }
              if (data.sources[i].source_id === 157) {
                let Hulu = document.createElement("a"); 
                let huluLI = document.createElement("li"); 
                let huluHref = data.sources[i].web_url
                Hulu.textContent = "Hulu"
                Hulu.setAttribute("href", huluHref);
                Hulu.setAttribute("target", "_blank"); 
                huluLI.appendChild(Hulu)
                huluLI.classList.add("streaming-btn", "btn"); 
                streamingResultsList.appendChild(huluLI); 
                
              }
              if (data.sources[i].source_id === 26) {
                let amazonPrime = document.createElement("a"); 
                let amazonLI = document.createElement("li"); 
                let amazonHref = data.sources[i].web_url
                amazonPrime.textContent = "Amazon Prime"
                amazonPrime.setAttribute("href", amazonHref);
                amazonPrime.setAttribute("target", "_blank"); 
                amazonLI.appendChild(amazonPrime)
                amazonLI.classList.add("streaming-btn", "btn"); 
                streamingResultsList.appendChild(amazonLI); 
               
              }
              if (data.sources[i].source_id === 387) {
                let HBOMax = document.createElement("a"); 
                let maxLI = document.createElement("li"); 
                let maxHref = data.sources[i].web_url
                HBOMax.textContent = "HBO MAX"
                HBOMax.setAttribute("href", maxHref);
                HBOMax.setAttribute("target", "_blank"); 
                maxLI.appendChild(HBOMax); 
                maxLI.classList.add("streaming-btn", "btn"); 
                streamingResultsList.appendChild(maxLI); 
                 
              }
              if (data.sources[i].source_id === 145) {
                let HBOGo = document.createElement("a"); 
                let goLI = document.createElement("li"); 
                let goHref = data.sources[i].web_url
                HBOGo.textContent = "HBO GO"
                HBOGo.setAttribute("href", goHref);
                HBOGo.setAttribute("target", "_blank");
                goLI.appendChild(HBOGo);
                goLI.classList.add("streaming-btn", "btn"); 
                streamingResultsList.appendChild(goLI); 
                
              }
              if (data.sources[i].source_id === 146) {
                let HBONow = document.createElement("a"); 
                let nowLI = document.createElement("li"); 
                let nowHref = data.sources[i].web_url
                HBONow.textContent = "HBO NOW"
                HBONow.setAttribute("href", nowHref);
                HBONow.setAttribute("target", "_blank"); 
                nowLI.appendChild(HBONow);
                nowLI.classList.add("streaming-btn", "btn"); 
                streamingResultsList.appendChild(nowLI); 
             
              }
              if (data.sources[i].source_id === 372) {
                let disneyPlus = document.createElement("a"); 
                let disneyLI = document.createElement("li"); 
                let disneyHref = data.sources[i].web_url
                disneyPlus.textContent = "Disney +"
                disneyPlus.setAttribute("href", disneyHref);
                disneyPlus.setAttribute("target", "_blank"); 
                disneyLI.appendChild(disneyPlus);
                disneyLI.classList.add("streaming-btn", "btn"); 
                streamingResultsList.appendChild(disneyLI); 
              
              }
              if (data.sources[i].source_id === 371) {
                let appleTV = document.createElement("a"); 
                let appleLI = document.createElement("li"); 
                let appleHref = data.sources[i].web_url
                appleTV.textContent = "AppleTV+"
                appleTV.setAttribute("href", appleHref);
                appleTV.setAttribute("target", "_blank"); 
                appleLI.appendChild(appleTV);
                appleLI.classList.add("streaming-btn", "btn"); 
                streamingResultsList.appendChild(appleLI); 
               
              }
            } else {
              //appends links to an accordian feature 
              let link = data.sources[i].web_url;
              let price = data.sources[i].price; 
              let format = data.sources[i].format; 
              let li = document.createElement("li");
              let a = document.createElement("a"); 
              a.textContent = link + " / Price: " + price + " " + format; 
              a.setAttribute("href", data.sources[i].web_url); 
              a.setAttribute("target", "_blank")
              li.appendChild(a); 
              additionalList.appendChild(li);
              li.classList.add("add-li"); 
            }
          }

        });
      } else {
        console.log('Error');
      }
    })
    .catch(function (error) {
      console.log('Unable to locate Movie Title.');
    });


};



