$(document).ready(function () {
  // VARIABLE DECLARATIONS

  // Search Section
  var cityInput = $("#city-input");
  var submitBtn = $("#submit-btn");
  var searchHistory = $("#search-history");
  var cityBtn = $(".city-btn");

  // Current Weather Section
  var currentCityDate = $("#current-city-date");
  var currentIcon = $("#current-icon");
  var currentDescription = $("#current-description");
  var currentTemp = $("#current-temp");
  var currentHumidity = $("#current-humidity");
  var currentWindSpeed = $("#current-wind-speed");
  var currentUV = $("#current-uv");

  // Forecast Section -
  var forecastWeather = $("#forecast-div");

  // City History Buttons on page load
  displaySearchHistory();

  // Current Weather Data
  function getCurrentWeather(cityName) {
    var currentWeatherURL =
      "https://api.weatherbit.io/v2.0/current?city=" +
      cityName +
      "&country=US&key=020dba26b42c4d61b7324a5ea43152c7&units=I";
    fetch(currentWeatherURL)
      .then(function (response) {
        return response.json();
      })

      // setting variables of data from API - use Math.round() to show whole number
      .then(function (data) {
        var current = {
          city: data.data[0].city_name,
          date: data.data[0].datetime,
          weatherIcon: data.data[0].weather.icon,
          weatherStatus: data.data[0].weather.description,
          temp: Math.round(data.data[0].temp),
          humidity: Math.round(data.data[0].rh),
          windSpeed: Math.round(data.data[0].wind_spd),
          uv: Math.round(data.data[0].uv),
        };

        console.log(current);
        displayCurrent(current, cityName);
      });
  }

  // Forecasted Weather
  function getForecastWeather(cityName) {
    var forecastWeatherURL =
      "https://api.weatherbit.io/v2.0/forecast/daily?city=" +
      cityName +
      "&country=US&key=020dba26b42c4d61b7324a5ea43152c7&units=I&days=5";
    fetch(forecastWeatherURL)
      .then(function (response) {
        return response.json();
      })
      // setting variables of data from API
      .then(function (data) {
        console.log(data);
        var forecastData = data;
        displayForecast(forecastData, cityName);
      });
  }

  // Submitting City - new input
  $(submitBtn).on("click", function (event) {
    event.preventDefault;

    var cityName = $(cityInput).val().trim().toUpperCase();
    console.log(cityName);

    // Forcing user to enter valid city
    if (cityName === "") {
      alert("Please enter valid city.");
      return;
    }

    // function to access local storage
    var cityStorage = getCityStorage();
    console.log(cityStorage);
    var newCity = {
      name: cityName,
    };

    // Preventing new button from being added when it already exists
    var index = cityStorage.findIndex((object) => object.name === cityName);

    if (index === -1) {
      cityStorage.push(newCity);
    }

    //storing new city data
    localStorage.setItem("cityStorage", JSON.stringify(cityStorage));

    // clearing search bar after clicking search button
    $(cityInput).val("");

    // Calling function to display city buttons
    displaySearchHistory();

    // Calling functions for API calls
    getCurrentWeather(cityName);
    getForecastWeather(cityName);
    historyClick();
  });

  historyClick();
  function historyClick() {
  //Submitting city - history
  $(".city-btn").on("click", function (event) {
    event.preventDefault;
    var eventTarget = event.target;
    var cityName = eventTarget.id;
    console.log(cityName);

    // Calling functions for API calls
    getCurrentWeather(cityName);
    getForecastWeather(cityName);
  }); }

  function displaySearchHistory() {
    //Creating city history buttons
    var cityStorage = getCityStorage();

    // removing any buttons before appending to prevent repeated adds
    searchHistory.empty();

    for (var i = 0; i < cityStorage.length; i++) {
      var historyLi = document.createElement("li");
      var cityBtn =
        '<button class="city-btn" id="' +
        cityStorage[i].name +
        '">' +
        cityStorage[i].name +
        "</buttton>";
      $(searchHistory).append(historyLi);
      $(historyLi).append(cityBtn);
    }
  }

  // Local Storage
  function getCityStorage() {
    var cityStorage = [];

    var storedCities = localStorage.getItem("cityStorage");

    if (storedCities !== null) {
      cityStorage = JSON.parse(storedCities);
    }

    return cityStorage;
  }

  // Displaying current weather
  function displayCurrent(current, cityName) {
    var weatherIconsURL =
      '<img src="https://www.weatherbit.io/static/img/icons/' +
      current.weatherIcon +
      '.png"/>';

    // Removing previous weather icon
    $(currentIcon).empty();

    // Display weather data
    $(currentCityDate).text(cityName + ":     " + current.date);
    $(currentIcon).append(weatherIconsURL);
    $(currentDescription).text(current.weatherStatus);
    $(currentTemp).text(current.temp + " °F");
    $(currentHumidity).text(current.humidity + "%");
    $(currentWindSpeed).text(current.windSpeed + " m/s");
    $(currentUV).text(current.uv);

    // Displaying color based on UV index - color guide/scale coming from epa.gov
    if (current.uv <= 2) {
      $(currentUV).css({
        "background-color": "#6cff6c",
        padding: "0 8px 0 8px",
      });
    } else if (current.uv <= 5 && current.uv >= 3) {
      $(currentUV).css({
        "background-color": "#fcfc81",
        padding: "0 8px 0 8px",
      });
    } else if (current.uv <= 7 && current.uv >= 6) {
      $(currentUV).css({
        "background-color": "#ffad13",
        padding: "0 8px 0 8px",
      });
    } else if (current.uv <= 10 && current.uv >= 8) {
      $(currentUV).css({
        "background-color": "#ff5b5b",
        padding: "0 8px 0 8px",
      });
    } else
      $(currentUV).css({
        "background-color": "#e998e9",
        padding: "0 8px 0 8px",
      });
  }

  //Displaying 5-day forecast
  function displayForecast(forecastData) {
    // removing previous forecast
    $(forecastWeather).empty();

    // creating a card for each forecast day
    for (var i = 0; i < forecastData.data.length; i++) {
      var weatherIconsURL =
        '<img src="https://www.weatherbit.io/static/img/icons/' +
        forecastData.data[i].weather.icon +
        '.png"/>';

      // creating new html elements
      var forecastCard = document.createElement("div");
      var forecastCardTitle = document.createElement("h4");
      var forecastUl = document.createElement("ul");

      // li for every required data to be displayed
      var forecastLiDate = document.createElement("li");
      var forecastLiIcon = document.createElement("li");
      var forecastLiDescription = document.createElement("li");
      var forecastLiHighTemp = document.createElement("li");
      var forecastLiLowTemp = document.createElement("li");
      var forecastLiHumidity = document.createElement("li");
      var forecastLiWindSpeed = document.createElement("li");

      // Appending new elements
      $(forecastWeather).append(forecastCard);
      $(forecastCard).append(forecastCardTitle);
      $(forecastCard).append(forecastUl);
      $(forecastUl).append(
        forecastLiDate,
        forecastLiIcon,
        forecastLiDescription,
        forecastLiHighTemp,
        forecastLiLowTemp,
        forecastLiHumidity,
        forecastLiWindSpeed
      );
      //Displaying weather icon
      $(forecastLiIcon).append(weatherIconsURL);

      // Assigning Classes/id to appended elements for styling
      $(forecastCard).addClass("card");
      $(forecastCardTitle).addClass("card-title");
      $(forecastLiDate).attr("id", "forecast-date");

      // Adding text to display data
      $(forecastLiDate).text(forecastData.data[i].datetime);
      $(forecastLiDescription).text(forecastData.data[i].weather.description);
      $(forecastLiHighTemp).text(
        "High: " + Math.round(forecastData.data[i].high_temp) + " °F"
      );
      $(forecastLiLowTemp).text(
        "Low: " + Math.round(forecastData.data[i].low_temp) + " °F"
      );
      $(forecastLiHumidity).text(
        "Humidity: " + Math.round(forecastData.data[i].rh) + "%"
      );
      $(forecastLiWindSpeed).text(
        "Wind Speed: " + Math.round(forecastData.data[i].wind_spd) + " m/s"
      );
    }
  }
});
