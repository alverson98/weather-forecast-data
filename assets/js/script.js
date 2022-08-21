$(document).ready(function () {
  // VARIABLE DECLARATIONS

  // Search Section
  var cityInput = $("#city-input");
  var submitBtn = $("#submit-btn");
  var searchHistory = $("#search-history");
  
// Current Weather Section
var currentCityDate = $("#current-city-date");
var currentIcon = $("#current-icon")
var currentDescription = $("#current-description")
var currentTemp = $("#current-temp")
var currentHumidity = $("#current-humidity")
var currentWindSpeed = $("#current-wind-speed")
var currentUV = $("#currentUV")

// Forecast Section
  var forecastWeather = $("#forecast-div");
  var forecastCardTitle = $("h4")
  var forecastLiIcon = $("<li></li>")
  var spanIcon = $("<span></span>")
  var forecastLiDescription = $("<li></li>")
  var spanDescription = $("<span></span>")
  var forecastLiHighTemp = $("<li></li>")
  var spanHigh = $("<span></span>")
  var forecastLiLowTemp = $("<li></li>")
  var spanLow = $("<span></span>")
  var forecastLiHumidity = $("<li></li>")
  var spanHumidity = $("<span></span>")
  var forecastLiWindSpeed = $("<li></li>")
  var spanWindSpeed = $("<span></span>")

  // Appending new elements
  var forecastCard = $(forecastWeather).append("div")
  $(forecastCard).append(forecastCardTitle)
  $(forecastCard).append(forecastLiIcon, forecastLiDescription, forecastLiHighTemp, forecastLiLowTemp, forecastLiHumidity, forecastLiWindSpeed)

  $(forecastLiIcon).append(spanIcon);
  $(forecastLiDescription).append(spanDescription);
  $(forecastLiHighTemp).append(spanHigh);
  $(forecastLiLowTemp).append(spanLow);
  $(forecastLiHumidity).append(spanHumidity);
  $(forecastLiWindSpeed).append(spanWindSpeed);


  // Empty search variables
  var cityName = "";
  var cityHistoryArray = [];

  // API - weatherbit.io
  var currentWeatherURL =
    "https://api.weatherbit.io/v2.0/current?city=" +
    cityName +
    "&country=US&key=020dba26b42c4d61b7324a5ea43152c7&units=I";

  var forecastWeatherURL =
    "https://api.weatherbit.io/v2.0/forecast/daily?city=" +
    cityName +
    "&country=US&key=020dba26b42c4d61b7324a5ea43152c7&units=I&days=5";

  // Current Weather Data
  function getCurrentWeather(cityName) {
    fetch(currentWeatherURL)
      .then(function (response) {
        return response.json();
      })
      // setting variables of data from API
      .then(function (data) {
        var current = {
          city: data.data[0].city_name,
          date: data.data[0].datetime,
          weatherIcon: data.data[0].weather.icon,
          weatherStatus: data.data[0].weather.description,
          temp: data.data[0].temp,
          humidity: data.data[0].rh,
          windSpeed: data.data[0].wind_spd,
          uv: data.data[1].uv,
        };
      });
  }

  // Forecasted Weather
  function getForecastWeather(cityName) {
    fetch(forecastWeatherURL)
      .then(function (response) {
        return response.json();
      })
      // setting variables of data from API
      .then(function (data) {
        var forecast = {
          date: data.data[0].datetime,
          weatherIcon: data.data[0].weather.icon,
          weatherStatus: data.data[0].weather.description,
          highTemp: data.data[0].high_temp,
          LowTemp: data.data[0].low_temp,
          humidity: data.data[0].rh,
          windSpeed: data.data[0].wind_spd,
        };
      });
  }

  // Submitting City - new input or history
  $(submitBtn, cityBtn).on("click", function (event) {
    event.preventDefault;
    var clickEvent = $(event.target);
    // new city vs. city history select
    if (clickEvent.id === submitBtn) {
      var cityName = $(cityInput).val().trim();
    } else {
      var cityName = clickEvent.innerText;
    }

    // Calling functions for API calls
    getCurrentWeather(cityName);
    getForecastWeather(cityName);

    // Calling Local storage function update
    updateStorage(cityName);
  });

  // Local Storage
  function updateStorage(cityName) {
    var cityHistory = JSON.parse(localStorage.getItem(cityHistory));
    cityHistory.push(cityHistoryArray);

    localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
  }
});
