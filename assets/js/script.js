// ===================
// Samuel Maddox Notes
// ===================
// NOTE: All code I've provided below has not been tested and may have syntax errors. Use it more
// as pseudocode trying to get a point across rather than 100% functional code.
// ===================
// End Samuel Notes
// ===================

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

  var requestUrl = "https://www.omdbapi.com/?t="+title+"&apikey="+ apiKeyOMDB;

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

// ===================
// Samuel Maddox Notes
// ===================
// Up until this point you have been doing a good job of writing short functions. Short functions 
// are good. They are easier to read and easier to debug. Nothing pops out at me that I would change
//
// This next function is not a short function. There are a few things I would refactor. Let's see 
// what we can do to improve it.
// ===================
// End Samuel Notes
// ===================

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

              // ===================
              // Samuel Maddox Notes
              // ===================
              // There are 5 things I see to simplify this code.
              // 1) I might be missing something, but these if() if() if() statments would be 
              // better off as if() elseif() else(). source_id can only ever be a single value here.
              // if one of these if statements are true than all the others below it must be false.
              //
              // 2) These if statements are comparing source_id to some hard-coded value. We call 
              // these hard-coded values "Magic Numbers". They're magic numbers because they can be 
              // hard to infer their meaning. Luckly your code shows a pattern and I can infer the 
              // meaning, but the better way to do this is to store the magic number in a meaningfull
              // constant variable. At the top of this file I'd have code like this:
              const NETFLIX_ID = 203;
              const HULU_ID = 157;
              const AMAZON_PRIME = 26
              // Then, your if statement would look like this:
              if (data.sources[i].source_id === NETFLIX_ID) { /* your code here */ }
              //
              // 3) Another optimization we could make is using a switch statment instead of if/else.
              switch(data.sources[i].source_id) {
                case NETFLIX_ID:
                  /* Logic for NETFLIX ID */
                  break;
                case HULU_ID:
                  /* Logic for HULU ID */
                  break;
                /*etc ...*/
              }
              //
              // 4) I see a pattern in each one of these if statments. When we see patterns that 
              // usually means we can create a function and pass in values for the parts that 
              // change. 
              switch(data.sources[i].source_id) {
                case NETFLIX_ID:
                  createMoveSourceItem('Netflix', data.sources[i].web_url, streamingResultsList);
                  break;
                case HULU_ID:
                  createMoveSourceItem('Hulu', data.sources[i].web_url, streamingResultsList);
                  break;
                /*etc ...*/
              }
              function createMoveSourceItem(sourceName, webUrl, streamingList) {
                let aElement = document.createElement("a");
                let liElement = document.createElement("li");
                let href = webUrl;
                aElement.textContent = sourceName;
                aElement.setAttribute("href", href);
                aElement.setAttribute("target", "_blank");
                liElement.appendChild(Netflix);
                liElement.classList.add("streaming-btn", "btn");
                streamingList.appendChild(liElement);
              }
              // 5) Going even further, my switch statement still feels like a pattern. The only 
              // thing that changes is the hardcoded name. The best way to do this is, instead of
              // having const NETFLIX_ID at the top for every streaming service, let's have it be
              // an object:
              const NETFLIX = { id: 203, name: 'Netflix' };
              const HULU = { id: 157, name: 'Hulu' }
              // Then, lets add all of these constants into a streamingServices array
              const streamingServices = [NETFLIX, HULU, /*etc...*/]
              // Arrays have methods, one that I want to use is Array.find() method. If the array 
              // contains the thing we're searching for the find() method will return that thing, 
              // otherwise the find() method will return undefined
              const foundService = streamingServices.find((service) => service.id === data.sources[i].source_id)
              if (foundService) {
                createMoveSourceItem(foundService.name, data.sources[i].web_url, streamingResultsList);
              }
              // And there you have it, all the if statements have been shrunk to a few lines of 
              // code. I'll give a full refactored implementation of this runTitleAPI function at 
              // the bottom of this file.
              // ===================
              // End Samuel Notes
              // ===================

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


// =====================================================
// Samuel Maddox Notes (Refactored runTitleAPI function)
// =====================================================
const NETFLIX = { id: 203, name: 'Netflix' };
const HULU = { id: 157, name: 'Hulu' }
/*etc...*/

const streamingServices = [NETFLIX, HULU, /*etc...*/]

function createMoveSourceItem(sourceName, webUrl, streamingList) {
  let aElement = document.createElement("a");
  let liElement = document.createElement("li");
  let href = webUrl;
  aElement.textContent = sourceName;
  aElement.setAttribute("href", href);
  aElement.setAttribute("target", "_blank");
  liElement.appendChild(Netflix);
  liElement.classList.add("streaming-btn", "btn");
  streamingList.appendChild(liElement);
}

function runTitleAPI(movieID) {
  let titleURL = `https://api.watchmode.com/v1/title/${movieID}/details/?apiKey=${apiKeyMode}&regions=US&append_to_response=sources`

  fetch(titleURL)
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        console.log('Error');
      }
    })
    .then(function (data) {
      streamingResultsList.innerHTML = "";
      additionalList.innerHTML = "";
      for (let source of data.sources) {
        if (source.type === "sub") {
          const foundService = streamingServices.find((service) => service.id === data.sources[i].source_id)
          if (foundService) {
            createMoveSourceItem(foundService.name, source.web_url, streamingResultsList);
          }
        } else {
          let link = source.web_url;
          let price = source.price;
          let format = source.format;
          let li = document.createElement("li");
          let a = document.createElement("a");
          a.textContent = `${link} / Price: ${price} ${format}`
          a.setAttribute("href", source.web_url);
          a.setAttribute("target", "_blank")
          li.appendChild(a);
          additionalList.appendChild(li);
          li.classList.add("add-li");
        }
      }
      
    })
    .catch(function (error) {
      console.log('Unable to locate Movie Title.');
    });
};



